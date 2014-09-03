var Record   = require("../Record").Record;
var Property = require("../Property").Property;

var TEST_DATA = {
	tables: {
		users: [
			{ id: 1, name: "John", gender: "male", age: 20 },
			{ id: 2, name: "Jane", gender: "female", age: 21 }
		]
	},
	props: {
		users: {
			id     : new Property("id", { table: "users", primary: true, type: "number", notNull: true }),
			name   : new Property("name", { table: "users", type: "text", notNull: true }),
			gender : new Property("gender", { table: "users", type: "enum" }),
			age    : new Property("age", { table: "users", type: "number" })
		}
	}
};

exports.create = function (pkg, uri, extensions) {
	return new Driver(extensions);
};

function Driver(extensions) {
	this.extensions = extensions;
	this.props      = TEST_DATA.props;
	this.data       = {};

	for (var table in TEST_DATA.tables) {
		this.data[table] = [];

		for (var i = 0; i < TEST_DATA.tables[table].length; i++) {
			var o = {};

			for (var k in TEST_DATA.tables[table][i]) {
				o[k] = TEST_DATA.tables[table][i][k];
			}

			this.data[table].push(o);
		}
	}
}

Driver.prototype.open  = noop();
Driver.prototype.close = noop();

Driver.prototype.query = function (table, next) {
	var driver = this;

	if (!this.data.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	setImmediate(function () {
		var rows = [];

		for (var i = 0; i < driver.data[table].length; i++) {
			rows.push(new Record(driver, driver.data[table][i], driver.props[table]));
		}

		return next(null, rows);
	});

	return this;
};

Driver.prototype.save = function (table, changes, conditions, next) {
	if (!this.data.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	matches(this.data[table], conditions, function (i) {
		for (var k in changes) {
			this.data[table][i][k] = changes[k];
		}
	}.bind(this));

	return noop()(next);
};

Driver.prototype.remove = function (table, conditions, next) {
	if (!this.data.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	matches(this.data[table], conditions, function (i) {
		this.data[table].splice(i, 1);
	}.bind(this));

	return noop()(next);
};

function noop(err) {
	return function (next) {
		if (next) setImmediate(next, err || null);
		return this;
	};
}

function matches(data, conditions, next) {
	for (var i = 0; i < data.length; i++) {
		var match = true;

		for (var k in conditions) {
			if (data[i][k] !== conditions[k]) {
				match = false;
				break;
			}
		}

		if (match) next(i);
	}
}
