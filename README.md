# jsutils

Random scripts I use for many projects. 


## Getting started

### On the server

```sh
npm install treeder/jsutils
```

Then import with:

```js
import {api, apiInit} from 'jsutils/api.js'
```

### On the client

```js
import { api, apiInit } from 'https://cdn.jsdelivr.net/gh/treeder/jsutils@0/api.js'
```

## Usage

Then just use it in place of fetch:

```js
let r = await api(`/v1/posts`)
```
