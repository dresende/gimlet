var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Connection", function () {
	var con = null;

	before(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});
	after(function (done) {
		con.close(done);
	});

	it("should have a .query() method to query the low level driver", function (done) {
		con.should.have.property("query").of.type("function");

		return done();
	});

	it("should have a .use() method to use a plugin", function (done) {
		con.should.have.property("use").of.type("function");

		return done();
	});

	it("should have a .cease() method to stop using a plugin", function (done) {
		con.should.have.property("cease").of.type("function");

		return done();
	});

	it("should have an .open() method to connect to database", function (done) {
		con.should.have.property("open").of.type("function");

		return done();
	});

	it("should have a .close() method to disconnect from database", function (done) {
		con.should.have.property("close").of.type("function");

		return done();
	});
});
