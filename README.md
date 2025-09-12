# api function - an enhanced fetch

This package assumes your using a REST API with JSON requests and responses. And if you are, it will handle
setting headers for content-type and authorization, serialing and parsing JSON and some other nice tricks
like caching responses.

## Getting started

### On the server

```sh
npm install treeder/api
```

Then import:

```js
import { api, API, apiInit } from 'api'
```

### In the browser

```js
import { api, API, apiInit } from 'https://cdn.jsdelivr.net/gh/treeder/api@1/api.js'
```

- api is a generic API instance, ready to use just by calling `api(url, opts)` instead of `fetch(url, opts)`
- API is a class letting you instantiate and customize.
- apiInit lets you customize the default API instance.

## Usage

Then just use it in place of fetch:

```js
let r = await api(`/v1/users`)
```

Use with [models](https://github.com/treeder/models) package to get even better JSON parsing capabilities

```js
let r = await api(`/v1/user/123`)
let user = parseModel(r.user, User)
```

## Configure default instance

```js
apiInit({ apiURL: apiURL })
```

- apiURL will be prefixed to any calls.

### Authentication

Add headers to the API instance that will be used for all subsequent calls.

```js
apiInit({ headers: { Authorization: `apiKey ${process.env.API_KEY}` } })
```

## Multiple APIs

If you have different API's you are talking to, you can create new instances:

```js
const api2 = new API({ apiURL: 'https://somewhere.com' })
// then use it with:
let r = await api2.fetch('/abc')
```

## Errors

Any errors will throw an `APIError` which has a `status` field on it to check the code.

```js
try {
  let r = await api('https://x.com/abc')
} catch (e) {
  return Response.json({ error: e }, { status: e.status })
}
```

This is exported too so you can use it in your API's to return nice errors.

## Caching

Caching can really help reduce network traffic and increase performance
depending on your use case. This will only cache GET requests.

To use caching, you have to create an api object and use `fetchAndCache`.

```js
let api = new API()
let r = await api.fetchAndCache('https://somewhere.com/my/stuff')
```
