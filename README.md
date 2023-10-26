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
