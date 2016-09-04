'use strict';

const utils = require('./utils.js');

const schema = {
  version: { path: '[20]', type: 'string' }
};

class SessionData {
  constructor(data) {
    this._data = data;
    Object.assign(this, utils.parseEntity(data, schema));
  }

  toJSON() {
    return utils.dumpObject(this, schema);
  }

  static create(data) {
    return new SessionData(data);
  }
}
SessionData.schema = schema;

module.exports = SessionData;
