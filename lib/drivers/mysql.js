var Record   = require("../Record").Record;
var Property = require("../Property").Property;

exports.create = function (pkg, uri, extensions) {
	return new Driver(require(pkg).createConnection(uri), extensions);
};

function Driver(connection, extensions) {
	this.connection = connection;
	this.extensions = extensions;
}

Driver.prototype.open = function (next) {
	this.connection.connect(next);
};

Driver.prototype.close = function (next) {
	if (typeof this.connection.end == "function") {
		this.connection.end();
	} else {
		this.connection.destroy();
	}
	if (next) setImmediate(next);
};

Driver.prototype.query = function () {
	var args   = Array.prototype.slice.apply(arguments);
	var next   = args[args.length - 1];
	var driver = this;

	if (typeof next == "function") {
		args[args.length - 1] = function (err, rows, info) {
			if (err) {
				return next(err);
			}

			var props = {};

			if (info) {
				for (var i = 0; i < info.length; i++) {
					props[info[i].name] = define_property(info[i]);
				}
			} else if (rows && !Array.isArray(rows)) {
				info = rows;
				rows = null;
			}

			return next(null, rows ? rows.map(function (row) {
				return Object.freeze(new Record(driver, row, props));
			}) : rows);
		};
	}

	this.connection.query.apply(this.connection, args);

	return this;
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

function define_property(opts) {
	return new Property(opts.orgName, {
		table        : opts.orgTable,
		primary      : !!(opts.flags & 0x2),
		type         : convert_type(opts.type),
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
