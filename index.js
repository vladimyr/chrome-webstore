'use strict';

const Promise = require('pinkie-promise');
const debug = require('debug')('client');
const cheerio = require('cheerio');
const urlJoin = require('url-join');
const querystring = require('querystring');
const request = require('request');
const parseArray = require('./lib/utils.js').parseArray;
const SessionData = require('./lib/SessionData.js');
const ItemInfo = require('./lib/ItemInfo.js');

const noop = Function.prototype;
const CWS_URL = 'https://chrome.google.com/webstore';

function makeUrl(path, options) {
  options = options || {};
  let url = urlJoin(CWS_URL, path);

  if (options.query) {
    let qs = querystring.stringify(options.query);
    url = urlJoin(url, `?${ qs }`);
  }

  return url;
}

class ChromeWebstore {
  constructor(version) {
    if (!version) throw new Error('Chrome Webstore version is not provided!');
    this.version = version;
  }

  getItemInfo(id, callback) {
    callback = callback || noop;
    debug('#getItemInfo called with: id=%s, cwsVersion=%s', id, this.version);

    let query = { pv: this.version, hl: 'en', id };
    let url = makeUrl('/ajax/detail', { query });

    debug('Executing POST request to: %s', url);
    return new Promise((resolve, reject) => {
      request.post(url, (err, response, body) => {
        if (err) {
          callback(err);
          reject(err);
          return;
        }

        if (response.statusCode !== 200) {
          let err = new Error(`Server returned error! [id=${ id }]`);
          callback(err);
          reject(err);
          return;
        }

        let data = parseArray(body);
        let info = ItemInfo.create(data);
        callback(null, info);
        resolve(info);
      });
    });
  }

  static getVersion(callback) {
    callback = callback || noop;
    let url = makeUrl('/category/apps');

    debug('Executing GET request to: %s', url);
    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        if (err) {
          callback(err);
          reject(err);
          return;
        }

        debug('Received server response, extracting session data...');

        let $ = cheerio.load(body);
        let str = JSON.parse($('#cws-session-data').text());
        let sessionData = SessionData.create(str);

        debug('Session data: %j', sessionData);
        debug('cwsVersion: %s', sessionData.version);

        callback(null, sessionData.version);
        resolve(sessionData.version);
      });
    });
  }

  static createClient(version) {
    return new ChromeWebstore(version);
  }
}

module.exports = ChromeWebstore;
