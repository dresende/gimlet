var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Test Driver", function () {
	var con = null;

	before(function (done) {
		con = Gimlet.connect("test://");
		con.open(done);
	});

	after(function (done) {
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
			users[0].age = 30;
			users[0].save(function (err) {
				should.exist(err);

				return done();
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
});
