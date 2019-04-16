const should   = require("should");
const common   = require("../common");
const Types = common.gimlet_types();

describe("Types", () => {
	describe("Point", () => {
		let point = new Types.Point(1, 2);

		it("should be possible to create a Point", (done) => {
			point.should.have.property("x").of.type("number").eql(1);
			point.should.have.property("y").of.type("number").eql(2);

			return done();
		});

		it("should be possible to convert to SQL", (done) => {
			point.toSqlString().should.eql("ST_GeomFromText('POINT(1 2)')");

			return done();
		});
	});

	describe("Polygon", () => {
		let polygon = new Types.Polygon([ new Types.Point(1, 2), new Types.Point(3, 4) ], [ new Types.Point(5, 6), new Types.Point(7, 8) ]);

		it("should be possible to create a Polygon", (done) => {
			polygon.should.have.property("geometries").of.type("object").with.lengthOf(2);

			polygon.geometries[0][0].should.have.property("x").of.type("number").eql(1);
			polygon.geometries[0][0].should.have.property("y").of.type("number").eql(2);
			polygon.geometries[0][1].should.have.property("x").of.type("number").eql(3);
			polygon.geometries[0][1].should.have.property("y").of.type("number").eql(4);
			polygon.geometries[1][0].should.have.property("x").of.type("number").eql(5);
			polygon.geometries[1][0].should.have.property("y").of.type("number").eql(6);
			polygon.geometries[1][1].should.have.property("x").of.type("number").eql(7);
			polygon.geometries[1][1].should.have.property("y").of.type("number").eql(8);

			return done();
		});

		it("should be possible to convert to SQL", (done) => {
			polygon.toSqlString().should.eql("ST_GeomFromText('POLYGON((1 2, 3 4), (5 6, 7 8))')");

			return done();
		});
	});
});
