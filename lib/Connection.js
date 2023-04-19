const Extensions = require("./Extensions");
const drivers    = lookup_drivers(__dirname + "/drivers/");

class Connection {
	constructor(proto, uri, settings) {
		if (!drivers.hasOwnProperty(proto)) {
			throw new Error("Unknown connection type: " + proto);
		}

		const driver = (typeof drivers[proto] == "string" ? require(drivers[proto]) : drivers[proto]);

		this.extensions = new Extensions.Extensions;
		this.connection = driver.create(proto, uri, settings);

		this.connection.extensions = this.extensions;
		this.extensions.connection = this;

		settings.extensions.map((extension) => {
			this.use(extension);
		});
	}

	use(extension) {
		this.extensions.load(extension);

		return this;
	}

	cease(extension) {
		this.extensions.unload(extension);

		return this;
	}

	open(next) {
		this.connection.open(next);
	}

	ping(...args) {
		this.connection.ping(...args);

		return this;
	}

	handler() {
		return this.connection.connection();
	}

	loadExtensions() {
		if (this.extensions.prepare()) {
			this.extensions.emit("connection", this);
			return true;
		}

		return false;
	}
}

exports.Connection = Connection;

exports.register = function (proto, driver) {
	if (drivers.hasOwnProperty(driver)) {
		drivers[proto] = drivers[driver];
	} else {
		drivers[proto] = driver;
	}
};

function lookup_drivers(driver_path) {
	const files   = require("fs").readdirSync(driver_path);
	const drivers = {};

	files.filter((filename) => (filename.substr(filename.length - 3) == ".js")).map((filename) => {
		drivers[filename.substr(0, filename.length - 3)] = driver_path + filename;
	});

	return drivers;
}
