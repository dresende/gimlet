var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Record.remove()", () => {
	var con    = null;
	var record = null;

	before((done) => {
		con = Gimlet.connect("test://");
		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	after((done) => {
		con.close(done);
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.enumerable("remove");
		record.remove.should.be.a.Function;

		return done();
	});

	it("should remove element", (done) => {
		record.remove(() => {
			con.query("users", (err, users) => {
				should.not.exist(err);

				record.id.should.not.eql(users[0].id);

				return done();
			});
		});
	});
});

describe("Record.save()", () => {
	var con    = null;
	var record = null;

	before((done) => {
		con = Gimlet.connect("test://");
		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	after((done) => {
		con.close(done);
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.enumerable("save");
		record.save.should.be.a.Function;

		return done();
	});

	it("should save element if changes are made", (done) => {
		record.save({ name: "Jessica" }, (err) => {
			should.not.exist(err);

			return done();
		});
	});

	it("should save element if changes are made even without a callback", (done) => {
		record.save({ name: "Jessica" });

		setTimeout(() => {
			record.changed().should.be.false;

			return done();
		}, 100);
	});

	it("should be possible to call directly from connection", (done) => {
		con.save("users", { name: "Eric" }, { id: 1 });
		con.query("users", (err, users) => {
			should.not.exist(err);

			for (var i = 0; i < users.length; i++) {
				if (users[i].id == 1) {
					users[i].name.should.eql("Eric");
					break;
				}
			}

			return done();
		});
	});
});

describe("Record.changed()", () => {
	var con    = null;
	var record = null;

	before((done) => {
		con = Gimlet.connect("test://");
		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	after((done) => {
		con.close(done);
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.enumerable("changed");
		record.changed.should.be.a.Function;

		return done();
	});

	it("should return false initially", (done) => {
		record.changed().should.be.false;

		return done();
	});
});

describe("Record.changes()", () => {
	var con    = null;
	var record = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	afterEach((done) => {
		con.close(done);
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.enumerable("changes");
		record.changes.should.be.a.Function;

		return done();
	});

	it("should return an empty object", (done) => {
		record.changes().should.eql({});

		return done();
	});

	it("should return an object with changes", (done) => {
		record.name = "Jessica";
		record.changes().should.eql({ name: "Jessica" });

		return done();
	});
});

describe("Record.changes() / Record.changed()", () => {
	var con    = null;
	var record = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		con.use(($) => {
			$.on("record", (e) => {
				e.data.changes = "changes";
				e.data.changed = "changed";
			});
		});

		con.use("record-changes");
		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	afterEach((done) => {
		con.close(done);
	});

	it("should not overwrite properties if already defined", (done) => {
		should.not.exist(record.changes);
		should.not.exist(record.changed);

		return done();
	});
});
