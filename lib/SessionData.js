'use strict';

var utils = require('./utils.js');

var schema = {
  version: { path: '[20]', type: 'string' }
};

function SessionData(data) {
  this._data = data;
  utils.parseEntity(data, schema, this);
}

SessionData.prototype.toJSON = function() {
  return utils.dumpEntity(this, schema);
};

SessionData.forge = function(data) {
  return new SessionData(data);
};

module.exports = SessionData;
