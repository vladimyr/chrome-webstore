'use strict';

var _ = require('lodash');

function parseArray(arrStr) {
  arrStr = arrStr.replace(/^\)\]\}'/, '');
  arrStr = arrStr.replace(/,,+/g, function(match){
    return ',' + match.substring(1).replace(/,/g, 'null,');
  });

  return JSON.parse(arrStr);
}

function readValue(str, type) {
  if (!str)
    return str;

  if (type === 'string')
    return str;

  if (type === 'float')
    return parseFloat(str);

  if (type === 'int') {
    // strip commas
    str = str.replace(',', '');
    return parseInt(str, 10);
  }

  if (type === 'date') {
    var d = new Date(str);
    return d.toISOString().substring(0, 10);
  }

  return str;
}

function parseEntity(data, schema, dest) {
  var result = dest || {};

  _.forEach(schema, function(desc, path) {
    var str = _.get(data, desc.path);
    var value = readValue(str, desc.type);

    _.set(result, path, value);
  });
  return result;
}

function dumpEntity(entry, schema) {
  var result = {};

  _.forOwn(entry, function(value, key) {
    if (!_.startsWith(key, '_'))
      result[key] = entry[key];
  });

  return result;
}

module.exports = {
  parseEntity: parseEntity,
  dumpEntity: dumpEntity,
  parseArray: parseArray
};
