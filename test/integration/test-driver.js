const should = require("should");
const common = require("../common");
const Gimlet = common.gimlet();

describe("Test Driver", () => {
	let con = null;
	let db = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		db  = con.handler();

		return done();
	});

	it("should error on invalid table", (done) => {
		db.query("animals", (err) => {
			should.exist(err);

			return done();
		});
	});

	it("should error creating on invalid table", (done) => {
		db.create("unknown-animals", {}, (err) => {
			should.exist(err);

			return done();
		});
	});

	it("should error if saving to an invalid table", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].table = "animals";
				});
			});
		});

		db.query("users", (err, users) => {
			users[0].gender = "unknown";
			users[0].save((err) => {
				should.exist(err);

				return done();
			});
		});
	});

	it("should ignore invalid properties", (done) => {
		db.query("users", (err, users) => {
			users[0].vat = 12345;
			users[0].save((err) => {
				should.not.exist(err);
				users[0].should.not.have.property("vat");

				return done();
			});
		});
	});

	it("should error if saving from a table without primary properties", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].primary = false;
				});
			});
		});

		db.query("users", (err, users) => {
			users[0].name = "Josh";
			users[0].save((err) => {
				should.exist(err);

				return done();
			});
		});
	});

	it("should throw if saving from an invalid table and not setting callback", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].table = "animals";
				});
			});
		});

		var dom = require("domain").create();

		dom.on("error", (err) => {
			should.exist(err);

			return done();
		});

		dom.run(() => {
			db.query("users", (err, users) => {
				users[0].name = "Jasper";
				users[0].save();
			});
		});
	});

	it("should error if removing from an invalid table", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].table = "animals";
				});
			});
		});

		db.query("users", (err, users) => {
			users[0].remove((err) => {
				should.exist(err);

				return done();
			});
		});
	});

	it("should throw if removing from an invalid table and not setting callback", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].table = "animals";
				});
			});
		});

		var dom = require("domain").create();

		dom.on("error", (err) => {
			should.exist(err);

			return done();
		});

		dom.run(() => {
			db.query("users", (err, users) => {
				users[0].remove();
			});
		});
	});

	it("should error if removing from a table without primary properties", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				Object.keys(e.props).map((k) => {
					e.props[k].primary = false;
				});
			});
		});

		db.query("users", (err, users) => {
			users[0].remove((err) => {
				should.exist(err);

				return done();
			});
		});
	});
});
