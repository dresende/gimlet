var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Record.remove()", function () {
	var con    = null;
	var record = null;

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

	it("should be a non enumerable method", function (done) {
		record.should.not.have.enumerable("remove");
		record.remove.should.be.a.Function;

		return done();
	});

	it("should remove element", function (done) {
		record.remove(function () {
			con.query("users", function (err, users) {
				should.not.exist(err);

				record.id.should.not.eql(users[0].id);

				return done();
			});
		});
	});
});

describe("Record.save()", function () {
	var con    = null;
	var record = null;

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

	it("should be a non enumerable method", function (done) {
		record.should.not.have.enumerable("save");
		record.save.should.be.a.Function;

		return done();
	});

	it("should save element if changes are made", function (done) {
		record.save({ name: "Jessica" }, function (err) {
			should.not.exist(err);

			return done();
		});
	});

	it("should save element if changes are made even without a callback", function (done) {
		record.save({ name: "Jessica" });

		setTimeout(function () {
			record.changed().should.eql(0);

			return done();
		}, 100);
	});
});

describe("Record.changed()", function () {
	var con    = null;
	var record = null;

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

	it("should be a non enumerable method", function (done) {
		record.should.not.have.enumerable("changed");
		record.changed.should.be.a.Function;

		return done();
	});

	it("should return false initially", function (done) {
		record.changed().should.be.false;

		return done();
	});
});

describe("Record.changes()", function () {
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

	it("should be a non enumerable method", function (done) {
		record.should.not.have.enumerable("changes");
		record.changes.should.be.a.Function;

		return done();
	});

	it("should return an empty object", function (done) {
		record.changes().should.eql({});

		return done();
	});

	it("should return an object with changes", function (done) {
		record.name = "Jessica";
		record.changes().should.eql({ name: "Jessica" });

		return done();
	});
});

describe("Record.changes() / Record.changed()", function () {
	var con    = null;
	var record = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.use(function ($) {
			$.on("record", function (e) {
				e.data.changes = "changes";
				e.data.changed = "changed";
			});
		});
		con.use("record-changes");
		con.query("users", function (err, users) {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should not overwrite properties if already defined", function (done) {
		should.not.exist(record.changes);
		should.not.exist(record.changed);

		return done();
	});
});
