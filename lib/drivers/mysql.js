var Record   = require("../Record").Record;
var Property = require("../Property").Property;

exports.create = function (pkg, uri) {
	return new Driver(require(pkg).createPool(uri));
};

function Driver(pool) {
	this.pool       = pool;
	this.connection = null;
}

Driver.prototype.open = function (next) {
	this.pool.getConnection(next);
};

Driver.prototype.ping = function () {
	this.pool.ping.apply(this.pool, arguments);
};

Driver.prototype.transaction = function (next) {
	this.pool.getConnection(function (err, connection ) {
		if (err) {
			return (next ? next(err) : null);
		}

		this.connection = connection;

		return (next ? next() : null);
	}.bind(this));
};

Driver.prototype.commit = function (next) {
	if (!this.connection) {
		return (next ? next(new Error("No transaction connection found")) : null);
	}

	this.connection.commit(function (err) {
		this.connection.release();
		this.connection = null;
		return (next ? next(err) : null);
	}.bind(this));
};

Driver.prototype.rollback = function (next) {
	if (!this.connection) {
		return (next ? next(new Error("No transaction connection found")) : null);
	}

	this.connection.rollback(function (err) {
		this.connection.release();
		this.connection = null;
		return (next ? next(err) : null);
	}.bind(this));
};

Driver.prototype.close = function () {
	this.pool.end.apply(this.pool, arguments);
};

Driver.prototype.query = function () {
	var args   = Array.prototype.slice.apply(arguments);
	var next   = args[args.length - 1];
	var driver = this;
	var con    = null;

	if (typeof next == "function") {
		args[args.length - 1] = function (err, rows, info) {
			if (con) con.release();

			if (err) {
				return (typeof next == "function" ? next(err) : null);
			}

			var props = {}, alias = {};

			if (info) {
				for (var i = 0; i < info.length; i++) {
					props[info[i].name] = define_property(alias, info[i]);
				}
			} else if (rows && !Array.isArray(rows)) {
				info = rows;
				rows = null;
			}

			return next(null, rows ? rows.map(function (row) {
				for (var k in alias) {
					row[alias[k]] = row[k];
					delete row[k];
				}
				return new Record(driver, row, props);
			}) : info);
		};
	}

	if (this.connection !== null) {
		this.connection.query.apply(this.connection, args);
		return this;
	}

	this.pool.getConnection(function (err, _con) {
		if (err) {
			return (typeof next == "function" ? next(err) : null);
		}

		if (typeof next != "function") {
			args.push(function () {
				con.release();
			});
		}

		con = _con;

		con.query.apply(con, args);
	});

	return this;
};

Driver.prototype.create = function (table, data, next) {
	return this.query({
		sql    : "INSERT INTO ?? SET ?",
		values : [ table, data ]
	}, next);
};

Driver.prototype.save = function (table, changes, conditions, next) {
	var query = {
		sql    : "UPDATE ?? SET ",
		values : [ table ]
	};
	var tmp     = build_conditions(changes, ", ");

	query.sql   += tmp.sql;
	query.values = query.values.concat(tmp.values);

	tmp = build_conditions(conditions);

	query.sql   += " WHERE " + tmp.sql;
	query.values = query.values.concat(tmp.values);

	return this.query(query, next);
};

Driver.prototype.remove = function (table, conditions, next) {
	var query = {
		sql    : "DELETE FROM ??",
		values : [ table ]
	};
	var tmp     = build_conditions(conditions);

	if (tmp.sql) {
		query.sql   += " WHERE " + tmp.sql;
		query.values = query.values.concat(tmp.values);
	}

	return this.query(query, next);
};

function build_conditions(conditions, join) {
	var sql = [], values = [];

	for (var k in conditions) {
		sql.push("?? = ?");
		values.push(k);
		values.push(conditions[k]);
	}

	return {
		sql    : sql.join(join || " AND "),
		values : values
	};
}

function define_property(alias, opts) {
	if (!opts.orgTable) {
		var new_name = opts.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+$/, "");

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
