var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Connection.transaction", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://").handler();

		return done();
	});

	it("should be a function", (done) => {
		con.transaction.should.be.a.Function;

		return done();
	});

	it("should initiate a transaction and be able to commit", (done) => {
		con.transaction(() => {
			con.query("users", () => {
				con.commit(done);
			});
		});
	});

	it("should initiate a transaction and be able to rollback", (done) => {
		con.transaction(() => {
			con.query("users", () => {
				con.rollback(done);
			});
		});
	});
});
