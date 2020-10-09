const Record   = require("../Record").Record;
const Property = require("../Property").Property;

class Point {
	x = 0
	y = 0

	constructor(x = 0, y = 0) {
		if (x && typeof x == "object" && typeof x.x == "number" && typeof x.y == "number") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	toSqlString() {
		return `POINT(${this.x}, ${this.y})`;
	}
}

class Driver {
	constructor(pool, settings) {
		this.pool             = pool;
		this.settings         = settings;
		this.__releaseTimeout = this.settings.releaseTimeout * 1000;
	}

	connection() {
		let driver     = this;
		let connection = null;
		let $          = {
			point    : Point,
			escape   : (...args) => (this.pool.escape(...args)),
			escapeId : (...args) => (this.pool.escapeId(...args)),
			query    : (...args) => {
				if (driver.extensions.prepare($)) {
					driver.extensions.emit("connection", driver.extensions.connection);
				}

				let next = args[args.length - 1];
				let con  = null;

				if (typeof next == "function") {
					args[args.length - 1] = (err, rows, info) => {
						if (con) con.release();

						if (err) return next(err);

						let props = {}, alias = {};

						if (info) {
							info.map((item) => {
								props[item.name] = define_property(alias, item);
							});
						} else if (rows && !Array.isArray(rows)) {
							info = rows;
							rows = null;
						}

						return next(null, rows ? rows.map((row) => {
							Object.keys(alias).map((k) => {
								row[alias[k]] = row[k];

								delete row[k];
							});

							return new Record($, row, props);
						}) : info);
					};
				}

				if (connection !== null) {
					connection.query(...args);

					return $;
				}

				driver.getConnection((err, _con) => {
					if (err) {
						if (typeof next == "function") return next(err);

						return;
					}

					if (typeof next != "function") {
						args.push(() => {
							con.release();
						});
					}

					con = _con;
					con.lastQuery = args[0];

					con.query(...args);
				});

				return $;
			},
			queryRow: (...args) => {
				if (typeof args[args.length - 1] == "function") {
					let next = args.pop();

					args.push((err, rows) => {
						if (err) return next(err);

						return next(null, rows[0] || null);
					});
				}

				return $.query(...args);
			},
			queryOne: (...args) => {
				if (typeof args[args.length - 1] == "function") {
					let next = args.pop();

					args.push((err, rows) => {
						if (err) return next(err);
						if (rows.length === 0) return next(null, null);

						let k = Object.keys(rows[0]);

						return next(null, k.length ? rows[0][k[0]] : null);
					});
				}

				return $.query(...args);
			},
			create: (table, data, next) => {
				return $.query({
					sql    : "INSERT INTO ?? SET ?",
					values : [ table, data ]
				}, next);
			},
			save: (table, changes, conditions, next) => {
				let query = {
					sql    : "UPDATE ?? SET ",
					values : [ table ]
				};
				let tmp     = build_conditions(changes, ", ");

				query.sql   += tmp.sql;
				query.values = query.values.concat(tmp.values);

				tmp = build_conditions(conditions);

				query.sql   += " WHERE " + tmp.sql;
				query.values = query.values.concat(tmp.values);

				return $.query(query, next);
			},
			remove: (table, conditions, next) => {
				let query = {
					sql    : "DELETE FROM ??",
					values : [ table ]
				};
				let tmp     = build_conditions(conditions);

				if (tmp.sql) {
					query.sql   += " WHERE " + tmp.sql;
					query.values = query.values.concat(tmp.values);
				}

				return $.query(query, next);
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
			transaction: (next = () => {}) => {
				if (connection) return next(new Error("Transaction already in course"));

				driver.getConnection((err, con ) => {
					if (err) return next(err);

					connection = con;

					connection.beginTransaction((err) => {
						if (err) {
							connection.release();
							connection = null;

							return next(err);
						}

						return next();
					});
				});
			},
			commit: (next = () => {}) => {
				if (!connection) return next(new Error("No transaction connection found to commit"));

				connection.commit((err) => {
					connection.release();
					connection = null;

					return next(err);
				});
			},
			rollback: (next = () => {}) => {
				if (!connection) return next(new Error("No transaction connection found to rollback"));

				connection.rollback((err) => {
					connection.release();
					connection = null;

					return next(err);
				});
			},
			close: (...args) => {
				driver.pool.end(...args);
			}
		};

		$.extensions = this.extensions;

		return $;
	}

	getConnection(next) {
		if (!this.settings.debug || !this.__releaseTimeout) {
			return this.pool.getConnection(next);
		}

		this.pool.getConnection((err, con) => {
			if (err) return next(err);

			let release = con.release.bind(con);
			let timer   = setTimeout(() => {
				process.stderr.write("(GIMLET) " + (new Date) + "\n");
				process.stderr.write("[!] Connection to database held from pool for too long (more than " + this.settings.releaseTimeout + " seconds)\n");
				if (con.lastQuery) {
					process.stderr.write("\n");
					if (con.lastQuery.sql) {
						process.stderr.write("SQL: " + con.lastQuery.sql + "\n");
						process.stderr.write("     " + con.lastQuery.values.join(" , ") + "\n");
					} else {
						process.stderr.write("SQL: " + con.lastQuery + "\n");
					}
				}

				timer = null;
			}, this.__releaseTimeout);

			con.release = () => {
				if (timer) {
					clearTimeout(timer);
					timer = null;
				}

				return release();
			};

			return next(null, con);
		});
	}

	ping(...args) {
		this.pool.ping(...args);
	}

	open(next = () => {}) {
		this.getConnection((err, con) => {
			if (err) return next(err);

			con.release();

			return next();
		});
	}

	close(...args) {
		this.pool.end(...args);
	}
}

exports.create = (pkg, uri, settings) => {
	return new Driver(require(pkg).createPool(uri), settings || {});
};

function build_conditions(conditions, join) {
	let sql = [], values = [];

	Object.keys(conditions).map((k) => {
		sql.push("?? = ?");
		values.push(k);
		values.push(conditions[k]);
	});

	return {
		sql    : sql.join(join || " AND "),
		values : values
	};
}

function define_property(alias, opts) {
	if (!opts.orgTable) {
		let new_name = opts.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+$/, "");

		if (new_name != opts.name) {
			alias[opts.name] = new_name;
		}

		return new Property(opts.name, {
			table        : null,
			primary      : false,
			type         : convert_type(opts.columnType),
			len          : opts.length
		});
	}

	return new Property(opts.orgName, {
		table        : opts.orgTable,
		primary      : !!(opts.flags & 0x2),
		type         : convert_type(opts.columnType),
		len          : opts.length,
		defaultValue : opts["default"],
		notNull      : !!(opts.flags & 0x1)
	});
}

function convert_type(n) {
	switch (n) {
		case   0: // DECIMAL
		case   1: // TINYINT
		case   2: // SMALLINT
		case   3: // INT
		case   4: // FLOAT
		case   5: // DOUBLE
		case   8: // BIGINT
		case   9: // MEDIUMINT
		case 246: // NEWDECIMAL
			return "number";
		case   7: // TIMESTAMP
		case  10: // DATE
		case  11: // TIME
		case  12: // DATETIME
		case  13: // YEAR
		case  14: // NEWDATE
			return "date";
		case  15: // VARCHAR
		case 249: // TINYBLOB, TINYTEXT
		case 250: // MEDIUMBLOB, MEDIUMTEXT
		case 251: // LONGBLOB, LONGTEXT
		case 252: // BLOB, TEXT
		case 253: // VARCHAR, VARBINARY
		case 254: // CHAR, BINARY
			return "text";
		case  16: // BIT
			return "boolean";
		case 247: // ENUM
		case 248: // SET
			return "enum";
		case 255: // GEOMETRY
			return "geom";
	}
}
