var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Connection", () => {
	var con = null;

	before((done) => {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	after((done) => {
		con.close(done);
	});

	it("should have a .query() method to query the low level driver", (done) => {
		con.should.have.property("query").of.type("function");

		return done();
	});

	it("should have an .open() method to connect to database", (done) => {
		con.should.have.property("open").of.type("function");

		return done();
	});

	it("should have a .close() method to disconnect from database", (done) => {
		con.should.have.property("close").of.type("function");

		return done();
	});

	it("should have a .use() method to use a plugin", (done) => {
		con.should.have.property("use").of.type("function");

		return done();
	});

	it("should have a .cease() method to stop using a plugin", (done) => {
		con.should.have.property("cease").of.type("function");

		return done();
	});

	it("should have a .loadExtensions() method to load the current plugins list immediately", (done) => {
		con.should.have.property("loadExtensions").of.type("function");

		return done();
	});
});

describe("Connection.use()", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach((done) => {
		con.close(done);
	});

	it("can be used to load a module", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				e.record.custom_prop = 12345;
			});
		});

		con.query("users", (err, users) => {
			users[0].should.have.property("custom_prop", 12345);

			return done();
		});
	});

	it("can be used to load a module after querying", (done) => {
		// without this, the loaded plugin ahead will not be able to change record
		con.cease("record-freeze");

		con.query("users", (err, users) => {
			users[0].should.not.have.property("custom_prop");

			con.use(($) => {
				$.on("record", (e) => {
					e.record.custom_prop = 12345;
				});
			});

			con.query("users", (err, users) => {
				users[0].should.have.property("custom_prop", 12345);

				return done();
			});
		});
	});

	it("can be used to load a base module after querying", (done) => {
		con.cease("record-freeze");

		con.query("users", (err, users) => {
			(() => {
				con.use("record-freeze");
			}).should.not.throw();

			return done();
		});
	});

	it("can be used to move a plugin to the end of the load list", (done) => {
		// moves record-changes to the end (after record-freeze)
		con.use("record-changes");

		return done();
	});
});

describe("Connection.cease()", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach((done) => {
		con.close(done);
	});

	it("can be called before any query", (done) => {
		(() => {
			con.cease("record-freeze");
		}).should.not.throw();

		return done();
	});

	it("cannot be called after first query", (done) => {
		con.query("users", () => {
			(() => {
				con.cease("record-freeze");
			}).should.throw();

			return done();
		});
	});
});

describe("Connection.loadExtensions()", () => {
	var con = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach((done) => {
		con.close(done);
	});

	it("should return true on first call", (done) => {
		con.loadExtensions().should.be.true;

		return done();
	});

	it("should return false on second call", (done) => {
		con.loadExtensions().should.be.true;
		con.loadExtensions().should.be.false;

		return done();
	});
});
