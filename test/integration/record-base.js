const should = require("should");
const common = require("../common");
const Gimlet = common.gimlet();

describe("Record.remove()", () => {
	let con    = null;
	let record = null;

	before((done) => {
		con = Gimlet.connect("test://").handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.propertyWithDescriptor("remove", { enumerable: true });
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
	let con    = null;
	let record = null;

	before((done) => {
		con = Gimlet.connect("test://").handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.propertyWithDescriptor("save", { enumerable: true });
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
				if (users[i].id === 1) {
					users[i].name.should.eql("Eric");
					break;
				}
			}

			return done();
		});
	});
});

describe("Record.changed()", () => {
	let con    = null;
	let record = null;

	before((done) => {
		con = Gimlet.connect("test://").handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.propertyWithDescriptor("changed", { enumerable: true });
		record.changed.should.be.a.Function;

		return done();
	});

	it("should return false initially", (done) => {
		record.changed().should.be.false;

		return done();
	});
});

describe("Record.changes()", () => {
	let con    = null;
	let record = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://").handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should be a non enumerable method", (done) => {
		record.should.not.have.propertyWithDescriptor("changes", { enumerable: true });
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
	let con    = null;
	let record = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");

		con.use(($) => {
			$.on("record", (e) => {
				e.data.changes = "changes";
				e.data.changed = "changed";
			});
		});

		con.use("record-changes");

		con = con.handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should not overwrite properties if already defined", (done) => {
		should.not.exist(record.changes);
		should.not.exist(record.changed);

		return done();
	});
});


describe("printing Record", () => {
	let con    = null;
	let record = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://").handler();

		con.query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should have a proper inspect() method", (done) => {
		should.exist(record.inspect);
		record.inspect().should.be.of.type("string");

		return done();
	});
});
