'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

let args = build.getConfig().args;
let isProductionBundle = args._.indexOf('bundle') !== -1 && (args.ship || args.production || args.p);

if (isProductionBundle) {
  build.addSuppression(/Warning - \[sass\] The local CSS class/gi);
  // OR
  build.addSuppression(/Warning/gi);
}
var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.tslintCmd.enabled = false;
build.initialize(require('gulp'));
