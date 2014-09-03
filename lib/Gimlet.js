var url        = require("url");
var Connection = require("./Connection");

exports.Connection = Connection.Connection;

exports.connect = function (uri) {
	var con   = url.parse(uri);
	var proto = (con.protocol ? con.protocol.replace(/:$/, '') : "mysql");

	return new exports.Connection(proto, uri);
};

exports.register = function (proto, driver) {
	Connection.register(proto, driver);

	return this;
};
