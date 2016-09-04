# chrome-webstore

> Library for intracting with Chrome Webstore

## Install

```
$ npm install --save vladimyr/chrome-webstore
```


## Usage

```js
const cws = require('chrome-webstore');

let exampleId = 'pjldngiecbcfldpghnimmdelafenmbni';

cws.getVersion()
  .then(version => {
    let client = cws.createClient(version);
    return client.getItemInfo(targetId);
  })
  .then(info => console.log(JSON.stringify(info, null, 2)));
```


## API

Chrome Webstore package exposes class with following static methods: 

### `cws.getVersion()`

This method returns Promise that gets resolved with current Chrome Webstore timestamp.

### `cws.createClient(version)`

This method returns Chrome Webstore client targeted at specific Chrome Webstore version.

### Client API

When you create client by calling `cws.createClient(version)` you'll get back an instance with following API methods:

#### `.getItemInfo(extensionId)`

This method returns Promise that gets resolved with extension info object contaning all known remote properties.
