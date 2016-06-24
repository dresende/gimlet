var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Extensions.use", () => {
	var con = null;
	var db  = null;

	beforeEach((done) => {
		con = Gimlet.connect("test://");
		db  = con.handler();

		return done();
	});

	it("should load additional function properties", (done) => {
		var f = () => {};

		f.prop = 123;

		db.query("users", () => {
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
		db.query("users", () => {
			(() => {
				con.cease("unknown-extension");
			}).should.throw();

			return done();
		});
	});
});
