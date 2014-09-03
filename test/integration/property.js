var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Property", function () {
	var con    = null;
	var record = [];

	before(function (done) {
		con = Gimlet.connect("test://");
		con.query("users", function (err, users) {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	after(function (done) {
		con.close(done);
	});

	it("should not be possible to pass a text to a number property", function (done) {
		(function () {
			record.age = "test";
		}).should.throw(TypeError);

		return done();
	});

	it("should not be possible to pass null to a not null property", function (done) {
		(function () {
			record.id = null;
		}).should.throw(TypeError);

		return done();
	});

	it("should not be possible to change a primary property", function (done) {
		(function () {
			record.id = 123;
		}).should.throw(Error);

		return done();
	});

	it("should be possible to pass numbers as text and be automatically converted", function (done) {
		record.age = "30";
		record.age.should.eql(30).of.type("number");

		return done();
	});
});
