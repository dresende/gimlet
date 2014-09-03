var url        = require("url");
var Connection = require("./Connection");
var Settings   = require("./Settings");

exports.Connection = Connection.Connection;
exports.Settings   = Settings;

exports.connect = function (uri, settings) {
	var con   = url.parse(uri);
	var proto = (con.protocol ? con.protocol.replace(/:$/, '') : "mysql");

	return new exports.Connection(proto, uri, settings || Settings);
};

exports.register = function (proto, driver) {
	Connection.register(proto, driver);

	return this;
};
