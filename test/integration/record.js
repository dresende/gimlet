var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Record", function () {
	var con    = null;
	var record = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.query("users", function (err, users) {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	afterEach(function (done) {
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
});

describe("Record", function () {
	var Record = common.gimlet_record().Record;
	var con    = null;

	before(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	after(function (done) {
		con.close(done);
	});

	it("should not add non properties from data", function (done) {
		var data   = { id: 123, name: "John" };

		data.hasOwnProperty = function () { return false; };

		var record = new Record(con, data, {});

		record.should.not.have.enumerable("id");
		record.should.not.have.enumerable("name");

		return done();
	});
});
