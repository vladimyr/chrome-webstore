'use strict';

const forEach = require('lodash/forEach');
const pickBy = require('lodash/pickBy');
const startsWith = require('lodash/startsWith');
const get = require('lodash/get');
const set = require('lodash/set');

// Parse array string returned from Chrome Webstore.
function parseArray(arrStr) {
  arrStr = arrStr.replace(/^\)\]\}'/, '');
  arrStr = arrStr.replace(/,,+/g, match =>
    ',' + match.substring(1).replace(/,/g, 'null,'));

  return JSON.parse(arrStr);
}

function readValue(str, type) {
  if (!str) return str;

  if (type === 'string') return str;
  if (type === 'float') return parseFloat(str);
  if (type === 'int') {
    // Strip commas.
    str = str.replace(',', '');
    return parseInt(str, 10);
  }
  if (type === 'date') {
    let d = new Date(str);
    return d.toISOString().substring(0, 10);
  }

  return str;
}

function parseEntity(data, schema) {
  let result = {};

  forEach(schema, (desc, path) => {
    let str = get(data, desc.path);
    let val = readValue(str, desc.type);

    set(result, path, val);
  });
  return result;
}

function dumpObject(obj) {
  return pickBy(obj, prop => !startsWith(prop, '_'));
}

module.exports = {
  parseEntity,
  dumpObject,
  parseArray
};
