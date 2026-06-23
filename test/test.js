import { TestKit } from 'testkit'
import { errors } from './errors.js'
import { testCache } from './cache.js'

// create context:
let c = {
  env: process.env,
}
// create TestKit
let testKit = new TestKit(c, [errors, testCache])
// run
await testKit.run()
