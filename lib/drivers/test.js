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
			id     : { table: "users", primary: true, type: "number", notNull: true },
			name   : { table: "users", type: "text", notNull: true },
			gender : { table: "users", type: "enum" },
			age    : { table: "users", type: "number" }
		}
	}
};

exports.create = function (pkg, uri) {
	return new Driver();
};

function Driver() {
	this.props = {};
	this.data  = {};

	for (var table in TEST_DATA.props) {
		this.props[table] = {};

		for (var prop in TEST_DATA.props[table]) {
			this.props[table][prop] = new Property(prop, TEST_DATA.props[table][prop]);
		}
	}

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

Driver.prototype.connection = function () {
	var driver = this;
	var $      = {
		query: function (table, next) {
			if (driver.extensions.prepare($)) {
				driver.extensions.emit("connection", driver.extensions.connection);
			}

			if (typeof next != "function") return;

			if (!driver.data.hasOwnProperty(table)) {
				return noop(new Error("Table not found"))(next);
			}

			setImmediate(() => {
				var rows = [];

				for (var i = 0; i < driver.data[table].length; i++) {
					rows.push(new Record($, driver.data[table][i], driver.props[table]));
				}

				return next(null, rows);
			});
		},
		queryRow: function () {
			var args = Array.prototype.slice.apply(arguments);

			if (typeof args[args.length - 1] != "function") {
				return this.query.apply(this, args);
			}

			var next = args.pop();

			args.push(function (err, rows) {
				if (err) return next(err);

				return next(null, rows[0] || null);
			});

			return this.query.apply(this, args);
		},
		queryOne: function () {
			var args = Array.prototype.slice.apply(arguments);

			if (typeof args[args.length - 1] != "function") {
				return this.query.apply(this, args);
			}

			var next = args.pop();

			args.push(function (err, rows) {
				if (err) return next(err);
				if (rows.length === 0) return next(null, null);

				var k = Object.keys(rows[0]);

				return next(null, k.length ? rows[0][k[0]] : null);
			});

			return this.query.apply(this, args);
		},
		create: function (table, data, next) {
			if (!driver.data.hasOwnProperty(table)) {
				return noop(new Error("Table not found"))(next);
			}

			driver.data[table].push(data);

			return noop()(next);
		},
		save: function (table, changes, conditions, next) {
			if (!driver.data.hasOwnProperty(table)) {
				return noop(new Error("Table not found"))(next);
			}

			matches(driver.data[table], conditions, function (i) {
				for (var k in changes) {
					driver.data[table][i][k] = changes[k];
				}
			}.bind(driver));

			return noop()(next);
		},
		remove: function (table, conditions, next) {
			if (!driver.data.hasOwnProperty(table)) {
				return noop(new Error("Table not found"))(next);
			}

			matches(driver.data[table], conditions, function (i) {
				driver.data[table].splice(i, 1);
			}.bind(driver));

			return noop()(next);
		},
		transaction : noop(),
		commit      : noop(),
		rollback    : noop(),
		close       : noop()
	};

	$.extensions = this.extensions;

	return $;
};

Driver.prototype.open = noop();
Driver.prototype.ping = noop();

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
