var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Extensions.use", function () {
	var con   = null;

	beforeEach(function (done) {
		con   = Gimlet.connect("test://");

		return done();
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should load additional function properties", function (done) {
		var f = function () {};

		f.prop = 123;

		con.query("users", function () {
			con.use(f);

			con.should.have.property("prop").of.type("number").eql(123);

			return done();
		});
	});

	it("should be able to unload if not yet prepared", function (done) {
		(function () {
			con.cease("record-base");
		}).should.not.throw();

		return done();
	});

	it("should ignore if not found if not yet prepared", function (done) {
		(function () {
			con.cease("unknown-extension");
		}).should.not.throw();

		return done();
	});

	it("should throw if trying to unload after ready", function (done) {
		con.query("users", function () {
			(function () {
				con.cease("unknown-extension");
			}).should.throw();

			return done();
		});
	});
});
