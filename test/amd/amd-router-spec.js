var raptor = require('raptor');
var resources = raptor.require('raptor/resources');
var files = raptor.require('raptor/files');
var packaging = raptor.require('raptor/packaging');

var moduleManifest = resources.createFileResource(files.joinPaths(__dirname, '../../package.json'));
packaging.load(packaging.getPackageManifest(moduleManifest));

var tests = require('../tests.js');
tests('AMD', require('amd-router/Router'));