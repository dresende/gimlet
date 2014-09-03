var fs      = require("fs");
var drivers = lookup_drivers(__dirname + "/drivers/");

exports.Connection = Connection;

exports.register = function (proto, driver) {
	if (drivers.hasOwnProperty(driver)) {
		drivers[proto] = drivers[driver];
	} else {
		drivers[proto] = driver;
	}
};

function Connection(proto, uri) {
	if (!drivers.hasOwnProperty(proto)) {
		throw new Error("Unknown connection type: " + proto);
	}

	var driver = (typeof drivers[proto] == "string" ? require(drivers[proto]) : drivers[proto]);

	this.connection = driver.create(proto, uri);
}

Connection.prototype.query = function () {
	this.connection.query.apply(this.connection, arguments);

	return this;
};

Connection.prototype.open = function (next) {
	this.connection.open(next);
};

Connection.prototype.close = function (next) {
	this.connection.close(next);
};

function lookup_drivers(driver_path) {
	var files   = fs.readdirSync(driver_path);
	var drivers = {};

	for (var i = 0; i < files.length; i++) {
		if (files[i].substr(files[i].length - 3) != ".js") continue;

		drivers[files[i].substr(0, files[i].length - 3)] = driver_path + files[i];
	}

	return drivers;
}
