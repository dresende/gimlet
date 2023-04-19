const Record    = require("../Record").Record;
const Property  = require("../Property").Property;
const TEST_DATA = {
	tables: {
		users: [
			{ id: 1, name: "John", gender: "male", age: 20 },
			{ id: 2, name: "Jane", gender: "female", age: 21 }
		],
		empty: [
			{}
		]
	},
	props: {
		users: {
			id     : { table: "users", primary: true, type: "number", notNull: true },
			name   : { table: "users", type: "text", notNull: true },
			gender : { table: "users", type: "enum" },
			age    : { table: "users", type: "number" }
		},
		empty: {}
	}
};

class Driver {
	constructor() {
		this.props = {};
		this.data  = {};

		Object.keys(TEST_DATA.props).map((table) => {
			this.props[table] = {};

			Object.keys(TEST_DATA.props[table]).map((prop) => {
				this.props[table][prop] = new Property(prop, TEST_DATA.props[table][prop]);
			});
		});

		Object.keys(TEST_DATA.tables).map((table) => {
			this.data[table] = [];

			TEST_DATA.tables[table].map((list) => {
				const o = {};

				Object.keys(list).map((k) => {
					o[k] = list[k];
				});

				this.data[table].push(o);
			});
		});
	}

	connection() {
		const driver = this;
		const $      = {
			query: (table, next) => {
				if (driver.extensions.prepare($)) {
					driver.extensions.emit("connection", driver.extensions.connection);
				}

				if (typeof next != "function") return;

				if (!driver.data.hasOwnProperty(table)) {
					return noop(new Error("Table not found"))(next);
				}

				setImmediate(() => {
					const rows = [];

					driver.data[table].map((row) => {
						rows.push(new Record($, row, driver.props[table]));
					});

					return next(null, rows);
				});
			},
			queryRow: (...args) => {
				if (typeof args[args.length - 1] == "function") {
					const next = args.pop();

					args.push((err, rows) => {
						if (err) return next(err);

						return next(null, rows[0] || null);
					});
				}

				return $.query(...args);
			},
			queryOne: (...args) => {
				if (typeof args[args.length - 1] == "function") {
					const next = args.pop();

					args.push((err, rows) => {
						if (err) return next(err);
						if (rows.length === 0) return next(null, null);

						const k = Object.keys(rows[0]);

						return next(null, k.length ? rows[0][k[0]] : null);
					});
				}

				return $.query(...args);
			},
			create: (table, data, next) => {
				if (!driver.data.hasOwnProperty(table)) {
					return noop(new Error("Table not found"))(next);
				}

				driver.data[table].push(data);

				return noop()(next);
			},
			save: (table, changes, conditions, next) => {
				if (!driver.data.hasOwnProperty(table)) {
					return noop(new Error("Table not found"))(next);
				}

				matches(driver.data[table], conditions, function (i) {
					Object.keys(changes).map((k) => {
						driver.data[table][i][k] = changes[k];
					});
				}.bind(driver));

				return noop()(next);
			},
			remove: (table, conditions, next) => {
				if (!driver.data.hasOwnProperty(table)) {
					return noop(new Error("Table not found"))(next);
				}

				matches(driver.data[table], conditions, function (i) {
					driver.data[table].splice(i, 1);
				}.bind(driver));

				return noop()(next);
			},
			fetch: async (...args) => {
				return new Promise((resolve, reject) => {
					$.query(...args, (err, data) => {
						if (err) return reject(err);

						return resolve(data);
					});
				});
			},
			fetchRow: async (...args) => {
				return new Promise((resolve, reject) => {
					$.queryRow(...args, (err, data) => {
						if (err) return reject(err);

						return resolve(data);
					});
				});
			},
			fetchOne: async (...args) => {
				return new Promise((resolve, reject) => {
					$.queryOne(...args, (err, data) => {
						if (err) return reject(err);

						return resolve(data);
					});
				});
			},
			transaction : noop(),
			commit      : noop(),
			rollback    : noop(),
			close       : noop(),
		};

		$.extensions = this.extensions;

		return $;
	}

	open(next = () => {}) {
		next();
	}

	ping(next = () => {}) {
		next();
	}
}

exports.create = () => {
	return new Driver();
};

function noop(err) {
	return function (next) {
		if (next) setImmediate(next, err || null);

		return this;
	};
}

function matches(data, conditions, next) {
	data.map((item, i) => {
		if (Object.keys(conditions).every((k) => (item[k] === conditions[k]))) {
			return next(i);
		}
	});
}
