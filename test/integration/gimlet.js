var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Gimlet", () => {
	it("should have a .connect() method to prepare a connection", (done) => {
		Gimlet.should.have.property("connect").of.type("function");

		return done();
	});

	it("should have a .register() method to register drivers", (done) => {
		Gimlet.should.have.property("register").of.type("function");

		return done();
	});

	it("should have a .Connection object to manually create connections", (done) => {
		Gimlet.should.have.property("Connection").of.type("function");

		return done();
	});
});

describe("Gimlet.connect()", () => {
	it("should throw if the protocol is not supported", (done) => {
		(() => {
			Gimlet.connect("unknown-proto://");
		}).should.throw();

		return done();
	});

	it("should not throw if not passed a string", (done) => {
		(() => {
			Gimlet.connect();
		}).should.not.throw();

		return done();
	});

	it("should not throw if passed other thing not a string", (done) => {
		(() => {
			Gimlet.connect([1,2,3]);
		}).should.not.throw();

		return done();
	});

	it("should accept test protocol and not throw", (done) => {
		(() => {
			Gimlet.connect("test://");
		}).should.not.throw();

		return done();
	});
});

describe("Gimlet.register()", () => {
	it("should allow users to symlink drivers", (done) => {
		Gimlet.register("new-proto", "test");

		(() => {
			Gimlet.connect("new-proto://"); // same as test
		}).should.not.throw();

		return done();
	});

	it("should allow custom drivers", (done) => {
		Gimlet.register("new-proto", {
			create: () => {
				return "new-protocol";
			}
		});

		var obj = Gimlet.connect("new-proto://");

		obj.connection.should.eql("new-protocol");

		return done();
	});
});
