const Connection = require("./Connection");
const Types      = require("./Types");
const Settings   = require("./Settings");

exports.Connection = Connection.Connection;
exports.settings   = Settings.defaults;
exports.types      = Types;

exports.connect = (uri, settings) => {
	const con   = (typeof uri != "object" && uri ? new URL(uri) : (uri || {}));
	const proto = (con.protocol ? con.protocol.replace(/:$/, "") : "test");

	return new exports.Connection(proto, uri, Settings.extend(settings));
};

exports.register = function (proto, driver) {
	Connection.register(proto, driver);

	return this;
};
