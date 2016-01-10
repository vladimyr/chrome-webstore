'use strict';

var cws = require('../index.js');
var client;

// Kippt extension id
var exampleId = 'pjldngiecbcfldpghnimmdelafenmbni';
var targetId = process.argv[2] || exampleId;

cws.getVersion()
  .then(function obtained(version) {
    client = cws.createClient(version);
    return client.getItemInfo(targetId);
  })
  .then(function complete(info) {
    console.log(JSON.stringify(info, null, 2));
  });
