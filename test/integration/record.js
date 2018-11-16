const should = require("should");
const common = require("../common");
const Gimlet = common.gimlet();

describe("Record", () => {
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

	it("should have enumerable properties attached", (done) => {
		record.should.have.propertyWithDescriptor("id", { enumerable: true });
		record.should.have.propertyWithDescriptor("name", { enumerable: true });
		record.should.have.propertyWithDescriptor("gender", { enumerable: true });

		return done();
	});

	it("should be frozen by default", (done) => {
		Object.isFrozen(record).should.be.true;

		return done();
	});
});

describe("Record", () => {
	let Record = common.gimlet_record().Record;
	let con    = null;

	before((done) => {
		con = Gimlet.connect("test://").handler();

		return done();
	});

	it("should not add non properties from data", (done) => {
		let data = { id: 123, name: "John" };

		data.hasOwnProperty = () => { return false; };

		let record = new Record(con, data, {});

		record.should.not.have.propertyWithDescriptor("id", { enumerable: true });
		record.should.not.have.propertyWithDescriptor("name", { enumerable: true });

		return done();
	});
});
