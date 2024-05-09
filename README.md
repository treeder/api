# api function - an enhanced fetch

This package assumes your using a REST API with JSON requests and responses. And if you are, it will handle
setting headers for content-type and authorization, serialing and parsing JSON and some other nice tricks
like caching responses.

## Getting started

### On the server

```sh
npm install treeder/api
```

Then import with:

```js
import { api, API, apiInit } from 'api'
```

### On the client

```js
import { api,  API, apiInit } from 'https://cdn.jsdelivr.net/gh/treeder/api@0/api.js'
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

## Caching

Caching can really help reduce network traffic and increase performance 
depending on your use case. 

To use caching, you have to create an api object:

```js
let api = new API()
let r = await api.fetchAndCache('https://somewhere.com/my/stuff')
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

```js
const api2 = new API({ apiURL: 'https://somewhere.com', getToken: () => this.options.apiToken })
// then use it with:
let r = await api2.fetch('/abc')
```
