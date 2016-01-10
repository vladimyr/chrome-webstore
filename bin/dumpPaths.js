'use strict';

var fs = require('fs');
var util = require('util');

var file = process.argv[2];

var stack = [];

function printPath(index) {
  var arr = stack.concat([ index ]);
  return arr.map(function(index) {
    return util.format('[%d]', index);
  }).join('');
}

function printArr(arr) {
  arr.forEach(function(value, i) {
    if (Array.isArray(value)) {
      stack.push(i);
      printArr(value);
      stack.pop();
      return;
    }

    console.log(printPath(i), value);
  });
}

fs.readFile(file,function(err, data) {
  var arr = JSON.parse(data);
  printArr(arr);
});
