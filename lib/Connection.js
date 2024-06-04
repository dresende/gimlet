const Extensions = require("./Extensions");
const drivers    = lookup_drivers(__dirname + "/drivers/");

class Connection {
	constructor(proto, uri, settings) {
		if (!drivers.hasOwnProperty(proto)) {
			throw new Error("Unknown connection type: " + proto);
		}

		const driver = (typeof drivers[proto] == "string" ? require(drivers[proto]) : drivers[proto]);

		this.extensions = new Extensions.Extensions;
		this.connection = driver.create(proto, (typeof uri != "object" ? parse_url(uri) : uri), settings);

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

function parse_url(uri) {
	const url     = new URL(uri);
	const options = {
		host              : url.hostname,
		port              : url.port,
		user              : url.username,
		password          : decodeUriComponent(url.password),
		database          : url.pathname.substr(1),
		timezone          : "Z",
		charset           : "utf8mb4",
		supportBigNumbers : false,
	};

	if (url.searchParams) {
		for (const k of url.searchParams.keys()) {
			let val = url.searchParams.get(k);

			if (val == "true")       val = true;
			else if (val == "false") val = false;
			else if (+val > 0)       val = +val;

			options[k] = val;
		}
	}

	return options;
}

function decodeUriComponent(str) {
	return str.replace(/\%([a-f0-9]{2})/ig, (_, hex) => (String.fromCharCode(parseInt(hex, 16))));
}
