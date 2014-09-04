var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Gimlet", function () {
	it("should have a .connect() method to prepare a connection", function (done) {
		Gimlet.should.have.property("connect").of.type("function");

		return done();
	});

	it("should have a .register() method to register drivers", function (done) {
		Gimlet.should.have.property("register").of.type("function");

		return done();
	});

	it("should have a .Connection object to manually create connections", function (done) {
		Gimlet.should.have.property("Connection").of.type("function");

		return done();
	});
});

describe("Gimlet.connect()", function () {
	it("should throw if the protocol is not supported", function (done) {
		(function () {
			Gimlet.connect("unknown-proto://");
		}).should.throw();

		return done();
	});

	it("should not throw if not passed a string", function (done) {
		(function () {
			Gimlet.connect();
		}).should.not.throw();

		return done();
	});

	it("should not throw if passed other thing not a string", function (done) {
		(function () {
			Gimlet.connect([1,2,3]);
		}).should.not.throw();

		return done();
	});

	it("should accept test protocol and not throw", function (done) {
		(function () {
			Gimlet.connect("test://");
		}).should.not.throw();

		return done();
	});
});

describe("Gimlet.register()", function () {
	it("should allow users to symlink drivers", function (done) {
		Gimlet.register("new-proto", "test");

		(function () {
			Gimlet.connect("new-proto://"); // same as test
		}).should.not.throw();

		return done();
	});

	it("should allow custom drivers", function (done) {
		Gimlet.register("new-proto", {
			create: function () {
				return "new-protocol";
			}
		});

		var obj = Gimlet.connect("new-proto://");

		obj.connection.should.eql("new-protocol");

		return done();
	});
});
