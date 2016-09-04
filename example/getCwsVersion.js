'use strict';

const cws = require('../index.js');

cws.getVersion()
  .then(version => console.log('Current Chrome Webstore version is:', version));
