import { TestKit } from 'testkit'
import { errors } from './errors.js'

// create context:
let c = {
  env: process.env,
}
// create TestKit
let testKit = new TestKit(c, [errors])
// run
await testKit.run()
