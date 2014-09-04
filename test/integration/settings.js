var should   = require("should");
var common   = require("../common");
var Settings = common.gimlet_settings();

describe("Settings", function () {
	it("should be possible to get default settings", function (done) {
		var settings = Settings.defaults;

		settings.should.have.property("extensions").of.type("object");

		return done();
	});

	it("should be possible to not pass any settings and have the defaults", function (done) {
		var settings = Settings.extend();

		settings.should.have.property("extensions").of.type("object");

		return done();
	});

	it("should be possible extend default settings", function (done) {
		var settings       = Settings.extend({ set: true });
		var other_settings = Settings.extend();

		settings.should.have.property("set").of.type("boolean");
		other_settings.should.not.have.property("set");

		return done();
	});

	it("should be possible change default settings", function (done) {
		var settings = Settings.extend({ extensions: [] });

		settings.should.have.property("extensions").of.type("object").with.lengthOf(0);

		return done();
	});
});
