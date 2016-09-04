'use strict';

const cws = require('../index.js');

// Kippt extension id
let exampleId = 'pjldngiecbcfldpghnimmdelafenmbni';
let targetId = process.argv[2] || exampleId;

cws.getVersion()
  .then(version => {
    let client = cws.createClient(version);
    return client.getItemInfo(targetId);
  })
  .then(info => console.log(JSON.stringify(info, null, 2)));
