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

	it("should have an .open() method to connect to database", function (done) {
		con.should.have.property("open").of.type("function");

		return done();
	});

	it("should have a .close() method to disconnect from database", function (done) {
		con.should.have.property("close").of.type("function");

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

	it("should have a .loadExtensions() method to load the current plugins list immediately", function (done) {
		con.should.have.property("loadExtensions").of.type("function");

		return done();
	});
});

describe("Connection.use()", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("can be used to load a module", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				e.record.custom_prop = 12345;
			});
		});

		con.query("users", function (err, users) {
			users[0].should.have.property("custom_prop", 12345);

			return done();
		});
	});

	it("can be used to load a module after querying", function (done) {
		// without this, the loaded plugin ahead will not be able to change record
		con.cease("record-freeze");

		con.query("users", function (err, users) {
			users[0].should.not.have.property("custom_prop");

			con.use(function ($) {
				$.on("record", function (e) {
					e.record.custom_prop = 12345;
				});
			});

			con.query("users", function (err, users) {
				users[0].should.have.property("custom_prop", 12345);

				return done();
			});
		});
	});

	it("can be used to load a base module after querying", function (done) {
		con.cease("record-freeze");

		con.query("users", function (err, users) {
			(function () {
				con.use("record-freeze");
			}).should.not.throw();

			return done();
		});
	});

	it("can be used to move a plugin to the end of the load list", function (done) {
		// moves record-changes to the end (after record-freeze)
		con.use("record-changes");

		return done();
	});
});

describe("Connection.cease()", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("can be called before any query", function (done) {
		(function () {
			con.cease("record-freeze");
		}).should.not.throw();

		return done();
	});

	it("cannot be called after first query", function (done) {
		con.query("users", function () {
			(function () {
				con.cease("record-freeze");
			}).should.throw();

			return done();
		});
	});
});

describe("Connection.loadExtensions()", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should return true on first call", function (done) {
		con.loadExtensions().should.be.true;

		return done();
	});

	it("should return false on second call", function (done) {
		con.loadExtensions().should.be.true;
		con.loadExtensions().should.be.false;

		return done();
	});
});
