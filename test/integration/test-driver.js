var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Test Driver", function () {
	var con = null;

	beforeEach(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	afterEach(function (done) {
		con.close(done);
	});

	it("should error on invalid table", function (done) {
		con.query("animals", function (err) {
			should.exist(err);

			return done();
		});
	});

	it("should error if saving to an invalid table", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
			});
		});

		con.query("users", function (err, users) {
			users[0].gender = "unknown";
			users[0].save(function (err) {
				should.exist(err);

				return done();
			});
		});
	});

	it("should error if saving from a table without primary properties", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].primary = false;
				}
			});
		});

		con.query("users", function (err, users) {
			users[0].name = "Josh";
			users[0].save(function (err) {
				should.exist(err);

				return done();
			});
		});
	});

	it("should throw if saving from an invalid table and not setting callback", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
			});
		});

		var dom = require("domain").create();

		dom.on("error", function (err) {
			should.exist(err);

			return done();
		});

		dom.run(function () {
			con.query("users", function (err, users) {
				users[0].name = "Jasper";
				users[0].save();
			});
		});
	});

	it("should error if removing from an invalid table", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
			});
		});

		con.query("users", function (err, users) {
			users[0].remove(function (err) {
				should.exist(err);

				return done();
			});
		});
	});

	it("should throw if removing from an invalid table and not setting callback", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].table = "animals";
				}
			});
		});

		var dom = require("domain").create();

		dom.on("error", function (err) {
			should.exist(err);

			return done();
		});

		dom.run(function () {
			con.query("users", function (err, users) {
				users[0].remove();
			});
		});
	});

	it("should error if removing from a table without primary properties", function (done) {
		con.use(function ($) {
			$.on("record", function (e) {
				for (var k in e.props) {
					e.props[k].primary = false;
				}
			});
		});

		con.query("users", function (err, users) {
			users[0].remove(function (err) {
				should.exist(err);

				return done();
			});
		});
	});
});
