'use strict';

const utils = require('./utils.js');

const schema = {
  id: { path: '[0][0]' },
  name: { path: '[0][1]' },
  author: { path: '[0][2]' },
  category: { path: '[0][10]' },
  type: { path: '[10]' },
  'icons.small': { path: '[0][3]' },
  'icons.medium': { path: '[0][4]' },
  'icons.large': { path: '[0][5]' },
  'rating.score': { path: '[0][12]', type: 'float' },
  'rating.votes': { path: '[0][22]', type: 'float' },
  users: { path: '[4]', type: 'int' },
  website: { path: '[3]' },
  webstoreUrl: { path: '[0][37]' },
  'description.title': { path: '[0][6]' },
  'description.content': { path: '[1]' },
  updated: { path: '[33]', type: 'date' },
  size: { path: '[25]' },
  version: { path: '[6]' },
  language: { path: '[8][0]' },
  // manifest: { path: '[9][0]' }
};

class ItemInfo {
  constructor(data) {
    // Extract data only.
    data = data[1][1];
    this._data = data;

    // Attach parsed info.
    Object.assign(this, utils.parseEntity(data, schema));
  }

  toJSON() {
    return utils.dumpObject(this);
  }

  static create(data) {
    return new ItemInfo(data);
  }
}
ItemInfo.schema = schema;

module.exports = ItemInfo;
