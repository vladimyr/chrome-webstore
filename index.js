'use strict';

var debug = require('debug')('client');
var util = require('util');
var pify = require('pify');
var cheerio = require('cheerio');
var urlJoin = require('url-join');
var querystring = require('querystring');
var request = require('request');
var parseArray = require('./lib/utils.js').parseArray;
var SessionData = require('./lib/SessionData.js');
var ItemInfo = require('./lib/ItemInfo.js');

var baseUrl = 'https://chrome.google.com/webstore';

function makeUrl(path, options) {
  options = options || {};
  var url = urlJoin(baseUrl, path);

  if (options.qs) {
    var q = querystring.stringify(options.qs);
    var qs = util.format('?%s', q);
    url = urlJoin(url, qs);
  }

  return url;
}

function ChromeWebstore(version) {
  if (!version)
    throw new Error('Chrome Webstore version is not provided!');

  this.version = version;
}

ChromeWebstore.makeUrl = makeUrl;

ChromeWebstore.createClient = function(version) {
  return new ChromeWebstore(version);
};

ChromeWebstore.prototype.getItemInfo = pify(function(id, callback) {
  debug('#getItemInfo called with: id=%s, cwsVersion=%s', id, this.version);

  var qs = {
    pv: this.version,
    hl: 'en',
    id: id
  };
  var url = ChromeWebstore.makeUrl('/ajax/detail', { qs: qs });

  debug('Executing POST request to: %s', url);
  request.post(url, function processResponse(err, response, body) {
    if (err) {
      callback(err);
      return;
    }

    if (response.statusCode !== 200) {
      callback(new Error(util.format('Server returned error! [id=%s]', id)));
      return;
    }

    var data = parseArray(body);
    callback(null, ItemInfo.forge(data));
  });
});

ChromeWebstore.getVersion = pify(function(callback) {
  var url = ChromeWebstore.makeUrl('/category/apps');

  debug('Executing GET request to: %s', url);
  return request.get(url, function extractVersion(err, response, body) {
    if (err) {
      callback(err);
      return;
    }

    debug('Received server response, extracting session data...');

    var $ = cheerio.load(body);
    var str = JSON.parse($('#cws-session-data').text());
    var sessionData = SessionData.forge(str);

    debug('Session data: %j', sessionData);
    debug('cwsVersion: %s', sessionData.version);

    callback(null, sessionData.version);
  });
});

module.exports = ChromeWebstore;
