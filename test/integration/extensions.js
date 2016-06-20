var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Extensions.use", () => {
	var con   = null;

	beforeEach((done) => {
		con   = Gimlet.connect("test://");

		return done();
	});

	afterEach((done) => {
		con.close(done);
	});

	it("should load additional function properties", (done) => {
		var f = () => {};

		f.prop = 123;

		con.query("users", () => {
			con.use(f);

			con.should.have.property("prop").of.type("number").eql(123);

			return done();
		});
	});

	it("should be able to unload if not yet prepared", (done) => {
		(() => {
			con.cease("record-base");
		}).should.not.throw();

		return done();
	});

	it("should ignore if not found if not yet prepared", (done) => {
		(() => {
			con.cease("unknown-extension");
		}).should.not.throw();

		return done();
	});

	it("should throw if trying to unload after ready", (done) => {
		con.query("users", () => {
			(() => {
				con.cease("unknown-extension");
			}).should.throw();

			return done();
		});
	});
});
