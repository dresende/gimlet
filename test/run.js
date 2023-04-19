const Mocha    = require("mocha");
const { glob } = require("glob");
const path     = require("path");
const location = path.normalize(path.join(__dirname, "integration", "*.js"));
const mocha    = new Mocha({
	reporter : "spec"
});

glob.sync(location).forEach(mocha.addFile.bind(mocha));

mocha.run(function (failures) {
	process.exit(failures);
});
