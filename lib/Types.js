exports.Point = class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toSqlString() {
		return `ST_GeomFromText('POINT(${this.x} ${this.y})')`;
	}
};

exports.Polygon = class Polygon {
	constructor(...geometries) {
		this.geometries = geometries;
	}

	toSqlString() {
		return `ST_GeomFromText('POLYGON(${this.geometries.map((geometry) => (`(${geometry.map((point) => (`${point.x} ${point.y}`)).join(", ")})`)).join(", ")})')`;
	}
};
