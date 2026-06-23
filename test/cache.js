import { assert } from 'testkit'
import { API } from '../api.js'

export async function testCache(c) {
  // Save original fetch
  const originalFetch = globalThis.fetch

  try {
    // 1. Mock fetch
    let fetchCount = 0
    globalThis.fetch = async (url, options) => {
      fetchCount++
      if (url.includes('fail')) {
        return {
          ok: false,
          status: 500,
          headers: {
            get: (name) => name.toLowerCase() === 'content-type' ? 'application/json' : null
          },
          json: async () => ({ error: 'failed' })
        }
      }
      return {
        ok: true,
        status: 200,
        headers: {
          get: (name) => name.toLowerCase() === 'content-type' ? 'application/json' : null
        },
        json: async () => ({ data: 'success', count: fetchCount })
      }
    }

    // 2. Test Default Caching behavior
    {
      fetchCount = 0
      const api = new API()
      assert(api.cache instanceof Map)
      
      let res1 = await api.fetchAndCache('https://example.com/api/test')
      assert(res1.count === 1)
      assert(fetchCount === 1)

      // Second call should be cached
      let res2 = await api.fetchAndCache('https://example.com/api/test')
      assert(res2.count === 1)
      assert(fetchCount === 1)

      // Test caching errors
      let errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail')
      } catch (e) {
        errorThrown = true
      }
      assert(errorThrown === true)
      assert(fetchCount === 2)

      // Second call to failed should also hit cache and throw without fetching again
      errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail')
      } catch (e) {
        errorThrown = true
      }
      assert(errorThrown === true)
      assert(fetchCount === 2)
    }

    // 3. Test Custom Caching behavior
    {
      fetchCount = 0
      const store = new Map()
      const mockCache = {
        get: async (key) => store.get(key),
        set: async (key, val) => { store.set(key, val) },
        delete: async (key) => { store.delete(key) }
      }

      const api = new API({ cache: mockCache })

      let res1 = await api.fetchAndCache('https://example.com/api/test-custom')
      assert(res1.count === 1)
      assert(fetchCount === 1)
      assert(store.has('https://example.com/api/test-custom'))

      // Second call should come from the custom cache
      let res2 = await api.fetchAndCache('https://example.com/api/test-custom')
      assert(res2.count === 1)
      assert(fetchCount === 1)

      // Delete from cache and verify it refetches
      await mockCache.delete('https://example.com/api/test-custom')
      let res3 = await api.fetchAndCache('https://example.com/api/test-custom')
      assert(res3.count === 2)
      assert(fetchCount === 2)

      // Test caching errors in custom cache
      let errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail-custom')
      } catch (e) {
        errorThrown = true
      }
      assert(errorThrown === true)
      assert(fetchCount === 3)
      assert(store.has('https://example.com/api/fail-custom'))

      // Second call to failed should throw without fetching
      errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail-custom')
      } catch (e) {
        errorThrown = true
      }
      assert(errorThrown === true)
      assert(fetchCount === 3)
    }

    // 4. Test Concurrent Calls (In-flight handling)
    {
      fetchCount = 0
      const store = new Map()
      const mockCache = {
        get: async (key) => store.get(key),
        set: async (key, val) => { store.set(key, val) },
        delete: async (key) => { store.delete(key) }
      }

      const api = new API({ cache: mockCache })

      // Start two concurrent calls
      let p1 = api.fetchAndCache('https://example.com/api/concurrent')
      let p2 = api.fetchAndCache('https://example.com/api/concurrent')

      let [r1, r2] = await Promise.all([p1, p2])
      assert(r1.count === 1)
      assert(r2.count === 1)
      assert(fetchCount === 1) // Should only fetch once!
    }

    // 5. Test prototype/property collision safety (e.g. key 'toString')
    {
      fetchCount = 0
      const api = new API()
      
      let res1 = await api.fetchAndCache('toString')
      assert(res1.count === 1)
      assert(fetchCount === 1)

      let res2 = await api.fetchAndCache('toString')
      assert(res2.count === 1)
      assert(fetchCount === 1)
    }

    // 6. Test persistent custom cache (JSON serialization / deserialization)
    {
      fetchCount = 0
      const store = new Map()
      const persistentCache = {
        get: async (key) => {
          let val = store.get(key)
          return val !== undefined ? JSON.parse(val) : undefined
        },
        set: async (key, val) => {
          store.set(key, JSON.stringify(val))
        },
        delete: async (key) => {
          store.delete(key)
        }
      }

      const api = new API({ cache: persistentCache })

      // Successful fetch
      let res1 = await api.fetchAndCache('https://example.com/api/persistent')
      assert(res1.count === 1)
      assert(fetchCount === 1)

      // Cached successful fetch
      let res2 = await api.fetchAndCache('https://example.com/api/persistent')
      assert(res2.count === 1)
      assert(fetchCount === 1)

      // Failed fetch
      let errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail-persistent')
      } catch (e) {
        errorThrown = true
        assert(e.status === 500)
        assert(e.message !== '')
      }
      assert(errorThrown === true)
      assert(fetchCount === 2)

      // Second call to failed (should retrieve from persistent cache, deserialize and throw error)
      errorThrown = false
      try {
        await api.fetchAndCache('https://example.com/api/fail-persistent')
      } catch (e) {
        errorThrown = true
        assert(e.status === 500)
        assert(e.message !== '')
      }
      assert(errorThrown === true)
      assert(fetchCount === 2)
    }

  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch
  }
}
