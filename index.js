var through = require('through2');
var util = require('util');

const IMPORTS = /^import ({?\w+(?:, ?\$?\w+)*}?) from ('(?:\w+[-.]?\w*\/?)*[^/]');\n/gm;
const DESTRUCTURED = /{(?:\w+,? ?)*[^,]}/;

function vars() {
  'use strict';

  var declarations = '';
  var names = arguments[1];
  var path = arguments[2];

  var destructured = DESTRUCTURED.test(names);

  names = names.replace(/\s|{|}/g, '').split(',');

  names.forEach(function (name) {
    if (destructured) {
      declarations += util.format('var %s = particle.load(%s).%s;\n', name, path, name);
    } else {
      declarations += util.format('var %s = particle.load(%s);\n', name, path);
    }
  });

  return declarations;
}

module.exports = function () {
  'use strict';

  return through.obj(function (file, encoding, callback) {
    var contents = file.contents.toString().replace(IMPORTS, vars);

    file.contents = new Buffer(contents);

    this.push(file);

    callback();
  });
};

