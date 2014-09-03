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

	it("should accept test protocol and not throw", function (done) {
		(function () {
			Gimlet.connect("test://");
		}).should.not.throw();

		return done();
	});
});
