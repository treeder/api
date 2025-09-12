import { assert } from 'testkit'
import { APIError } from '../api.js'

export async function errors(c) {
  let e = new APIError('this is an error', { status: 400 })
  console.log(e)
  let str = JSON.stringify(e)
  console.log(str)
  let j = JSON.parse(str)
  assert(j.message === 'this is an error')
  // assert(j.status === 400)
}
