var Mocha    = require("mocha");
var glob     = require("glob");
var path     = require("path");
var location = path.normalize(path.join(__dirname, "integration", "*.js"));
var mocha    = new Mocha({
	reporter : "spec"
});

glob.sync(location).forEach(mocha.addFile.bind(mocha));

mocha.run(function (failures) {
	process.exit(failures);
});
