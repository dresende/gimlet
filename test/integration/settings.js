const should   = require("should");
const common   = require("../common");
const Settings = common.gimlet_settings();

describe("Settings", () => {
	it("should be possible to get default settings", (done) => {
		let settings = Settings.defaults;

		settings.should.have.property("extensions").of.type("object");

		return done();
	});

	it("should be possible to not pass any settings and have the defaults", (done) => {
		let settings = Settings.extend();

		settings.should.have.property("extensions").of.type("object");

		return done();
	});

	it("should be possible extend default settings", (done) => {
		let settings       = Settings.extend({ set: true });
		let other_settings = Settings.extend();

		settings.should.have.property("set").of.type("boolean");
		other_settings.should.not.have.property("set");

		return done();
	});

	it("should be possible change default settings", (done) => {
		let settings = Settings.extend({ extensions: [] });

		settings.should.have.property("extensions").of.type("object").with.lengthOf(0);

		return done();
	});
});
