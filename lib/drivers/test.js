var Record   = require("../Record").Record;
var Property = require("../Property").Property;

var TEST_DATA = {
	users: [
		{ id: 1, name: "John", gender: "male", age: 20 },
		{ id: 2, name: "Jane", gender: "female", age: 21 }
	],
	users_props: {
		id     : new Property("id", { table: "users", primary: true, type: "number", notNull: true }),
		name   : new Property("name", { table: "users", type: "text", notNull: true }),
		gender : new Property("gender", { table: "users", type: "enum" }),
		age    : new Property("age", { table: "users", type: "number" })
	}
};

exports.create = function (pkg, uri, extensions) {
	return new Driver(extensions);
};

function Driver(extensions) {
	this.extensions = extensions;
}

Driver.prototype.open  = noop();
Driver.prototype.close = noop();

Driver.prototype.query = function (table, next) {
	var driver = this;

	if (!TEST_DATA.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	setImmediate(function () {
		var rows = [];

		for (var i = 0; i < TEST_DATA[table].length; i++) {
			rows.push(new Record(driver, TEST_DATA[table][i], TEST_DATA[table + "_props"]));
		}

		return next(null, rows);
	});

	return this;
};

Driver.prototype.save = function (table, changes, conditions, next) {
	if (!TEST_DATA.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	matches(TEST_DATA[table], conditions, function (i) {
		for (var k in changes) {
			TEST_DATA[table][i][k] = changes[k];
		}
	});

	return noop()(next);
};

Driver.prototype.remove = function (table, conditions, next) {
	if (!TEST_DATA.hasOwnProperty(table)) {
		return noop(new Error("Table not found"))(next);
	}

	matches(TEST_DATA[table], conditions, function (i) {
		TEST_DATA[table].splice(i, 1);
	});

	return noop(next)();
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
