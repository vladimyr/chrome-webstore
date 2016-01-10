'use strict';

var cws = require('../index.js');

cws.getVersion()
  .then(function complete(version) {
    console.log('Current Chrome Webstore version is: %s', version);
  })
  .catch(function(err) {
    console.error(err);
  });
