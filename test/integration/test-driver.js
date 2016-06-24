var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Test Driver", () => {
	var con = null;
	var db = null;

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

	it("should error if saving to an invalid table", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
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

	it("should error if saving from a table without primary properties", (done) => {
		con.use(($) => {
			$.on("record", (e) => {
				for (var k in e.props) {
					e.props[k].primary = false;
				}
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
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
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
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
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
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
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
				for (var k in e.props) {
					e.props[k].primary = false;
				}
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
