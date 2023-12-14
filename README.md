# api function - an enhanced fetch

## Getting started

### On the server

```sh
npm install treeder/api
```

Then import with:

```js
import { api, apiInit } from 'jsutils/api.js'
```

### On the client

```js
import { api, apiInit } from 'https://cdn.jsdelivr.net/gh/treeder/api@0/api.js'
```

### Configure

```js
apiInit({ apiURL: apiURL })
```

## Usage

Then just use it in place of fetch:

```js
let r = await api(`/v1/posts`)
```

## Authentication

To add an `Authorization` header, specify a getToken() function. 

This is an example you can use on the browser side if you are using Firebase Auth. 

```js
apiInit({ getToken: () => auth.currentUser.getIdToken() })
```

On the server, you do the same thing, but your token probably comes from an env var:

```js
apiInit({ getToken: () => process.env.API_KEY })
```

## Multiple APIs

If you have different API's you are talking to, you can create new instances:

```
const api2 = new API({ apiURL: 'https://somewhere.com', getToken: () => this.options.apiToken })
```
