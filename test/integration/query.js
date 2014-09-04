var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Connection.queryRow", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should return one element", function (done) {
		con.queryRow("users", function (err, user) {
			should.not.exist(err);
			Array.isArray(user).should.not.be.true;

			return done();
		});
	});

	it("should return error if any", function (done) {
		con.queryRow("animals", function (err) {
			should.exist(err);

			return done();
		});
	});

	it("should return null if none found", function (done) {
		con.query("users", function (err, users) {
			users.forEach(function (user) {
				user.remove();
			});

			con.queryRow("users", function (err, user) {
				should.not.exist(err);
				should.not.exist(user);

				return done();
			});
		});
	});

	it("should fallback to normal query if no callback passed", function (done) {
		con.queryRow("users");

		return done();
	});
});

describe("Connection.queryOne", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should return one value", function (done) {
		con.queryOne("users", function (err, id) {
			should.not.exist(err);
			id.should.be.of.type("number");

			return done();
		});
	});

	it("should return error if any", function (done) {
		con.queryOne("animals", function (err) {
			should.exist(err);

			return done();
		});
	});

	it("should return null if no rows found", function (done) {
		con.query("users", function (err, users) {
			users.forEach(function (user) {
				user.remove();
			});

			con.queryOne("users", function (err, id) {
				should.not.exist(err);
				should.not.exist(id);

				return done();
			});
		});
	});

	it("should fallback to normal query if no callback passed", function (done) {
		con.queryOne("users");

		return done();
	});
});
