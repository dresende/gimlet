var url        = require("url");
var Connection = require("./Connection");
var Settings   = require("./Settings");

exports.Connection = Connection.Connection;
exports.settings   = Settings.defaults;

exports.connect = function (uri, settings) {
	var con;

	try {
		con = url.parse(uri || "");
	} catch (e) {
		con = {};
	}

	var proto = (con.protocol ? con.protocol.replace(/:$/, '') : "test");

	return new exports.Connection(proto, uri, Settings.extend(settings));
};

exports.register = function (proto, driver) {
	Connection.register(proto, driver);

	return this;
};
