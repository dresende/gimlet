var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Record", function () {
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

	it("should have enumerable properties attached", function (done) {
		record.should.have.enumerable("id");
		record.should.have.enumerable("name");
		record.should.have.enumerable("gender");

		return done();
	});

	it("should be frozen by default", function (done) {
		Object.isFrozen(record).should.be.true;

		return done();
	});

	it("should have a not enumerable .save() method", function (done) {
		record.should.not.have.enumerable("save");
		record.save.should.be.a.Function;

		return done();
	});

	it("should have a not enumerable .remove() method", function (done) {
		record.should.not.have.enumerable("remove");
		record.remove.should.be.a.Function;

		return done();
	});

	it("should have a not enumerable .changed() method", function (done) {
		record.should.not.have.enumerable("changed");
		record.changed.should.be.a.Function;

		return done();
	});

	it("should have a not enumerable .changes() method", function (done) {
		record.should.not.have.enumerable("changes");
		record.changes.should.be.a.Function;

		return done();
	});

	describe(".changed() method", function () {
		it("should return false initially", function (done) {
			record.changed().should.be.false;

			return done();
		});
	});

	describe(".changes() method", function () {
		it("should return an empty object", function (done) {
			record.changes().should.eql({});

			return done();
		});
	});
});
