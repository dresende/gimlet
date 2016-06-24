var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Connection.queryRow", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://").handler();

		return done();
	});

	it("should return one element", (done) => {
		con.queryRow("users", (err, user) => {
			should.not.exist(err);
			Array.isArray(user).should.not.be.true;

			return done();
		});
	});

	it("should return error if any", (done) => {
		con.queryRow("animals", (err) => {
			should.exist(err);

			return done();
		});
	});

	it("should return null if none found", (done) => {
		con.query("users", (err, users) => {
			users.forEach((user) => {
				user.remove();
			});

			con.queryRow("users", (err, user) => {
				should.not.exist(err);
				should.not.exist(user);

				return done();
			});
		});
	});

	it("should fallback to normal query if no callback passed", (done) => {
		con.queryRow("users");

		return done();
	});
});

describe("Connection.queryOne", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://").handler();

		return done();
	});

	it("should return one value", (done) => {
		con.queryOne("users", (err, id) => {
			should.not.exist(err);
			id.should.be.of.type("number");

			return done();
		});
	});

	it("should return error if any", (done) => {
		con.queryOne("animals", (err) => {
			should.exist(err);

			return done();
		});
	});

	it("should return null if no rows found", (done) => {
		con.query("users", (err, users) => {
			users.forEach((user) => {
				user.remove();
			});

			con.queryOne("users", (err, id) => {
				should.not.exist(err);
				should.not.exist(id);

				return done();
			});
		});
	});

	it("should fallback to normal query if no callback passed", (done) => {
		con.queryOne("users");

		return done();
	});
});
