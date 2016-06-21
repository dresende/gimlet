var Extensions = require("./Extensions");

var drivers = lookup_drivers(__dirname + "/drivers/");

exports.Connection = Connection;

exports.register = function (proto, driver) {
	if (drivers.hasOwnProperty(driver)) {
		drivers[proto] = drivers[driver];
	} else {
		drivers[proto] = driver;
	}
};

function Connection(proto, uri, settings) {
	if (!drivers.hasOwnProperty(proto)) {
		throw new Error("Unknown connection type: " + proto);
	}

	var driver = (typeof drivers[proto] == "string" ? require(drivers[proto]) : drivers[proto]);

	this.extensions = new Extensions.Extensions;
	this.connection = driver.create(proto, uri, settings);

	this.connection.extensions = this.extensions;
	this.extensions.connection = this;

	for (var i = 0; i < settings.extensions.length; i++) {
		this.use(settings.extensions[i]);
	}
}

Connection.prototype.use = function (extension) {
	this.extensions.load(extension);

	return this;
};

Connection.prototype.cease = function (extension) {
	this.extensions.unload(extension);

	return this;
};

Connection.prototype.query = function () {
	if (this.extensions.prepare()) {
		this.extensions.emit("connection", this);
	}
	this.connection.query.apply(this.connection, arguments);

	return this;
};

Connection.prototype.ping = function () {
	this.connection.ping.apply(this.connection, arguments);

	return this;
};

Connection.prototype.transaction = function () {
	this.connection.transaction.apply(this.connection, arguments);

	return this;
};

Connection.prototype.commit = function () {
	this.connection.commit.apply(this.connection, arguments);

	return this;
};

Connection.prototype.rollback = function () {
	this.connection.rollback.apply(this.connection, arguments);

	return this;
};

Connection.prototype.queryRow = function () {
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
};

Connection.prototype.queryOne = function () {
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
};

Connection.prototype.open = function (next) {
	this.connection.open(next);
};

Connection.prototype.close = function (next) {
	this.connection.close(next);
};

Connection.prototype.remove = function () {
	this.connection.remove.apply(this.connection, arguments);
};

Connection.prototype.create = function () {
	this.connection.create.apply(this.connection, arguments);
};

Connection.prototype.save = function () {
	this.connection.save.apply(this.connection, arguments);
};

Connection.prototype.loadExtensions = function () {
	if (this.extensions.prepare()) {
		this.extensions.emit("connection", this);
		return true;
	}
	return false;
};

function lookup_drivers(driver_path) {
	var files   = require("fs").readdirSync(driver_path);
	var drivers = {};

	for (var i = 0; i < files.length; i++) {
		if (files[i].substr(files[i].length - 3) != ".js") continue;

		drivers[files[i].substr(0, files[i].length - 3)] = driver_path + files[i];
	}

	return drivers;
}
