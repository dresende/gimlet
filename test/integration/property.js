const should = require("should");
const common = require("../common");
const Gimlet = common.gimlet();

describe("Property", () => {
	let con    = null;
	let record = [];

	before((done) => {
		con = Gimlet.connect("test://");
		con.handler().query("users", (err, users) => {
			should.not.exist(err);

			record = users[0];

			return done();
		});
	});

	it("should not be possible to pass a text to a number property", (done) => {
		(() => {
			record.age = "test";
		}).should.throw(TypeError);

		return done();
	});

	it("should not be possible to pass null to a not null property", (done) => {
		(() => {
			record.id = null;
		}).should.throw(TypeError);

		return done();
	});

	it("should not be possible to change a primary property", (done) => {
		(() => {
			record.id = 123;
		}).should.throw(Error);

		return done();
	});

	it("should be possible to pass numbers as text and be automatically converted", (done) => {
		record.age = "30";
		record.age.should.eql(30).of.type("number");

		return done();
	});
});
