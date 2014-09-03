var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Test Connection", function () {
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
});
