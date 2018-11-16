const events = require("events");

class Extensions extends events.EventEmitter {
	constructor() {
		super();

		this.extensions = [];
		this.ready      = false;
	}

	prepare(connection) {
		if (this.ready) return false;

		this.ready = true;

		// special case: record-freeze
		let n = this.extensions.indexOf("record-freeze");
		let $ = {
			connection : connection,
			on         : this.on.bind(this),
			emit       : this.emit.bind(this)
		};

		if (n >= 0 && n < this.extensions.length - 1) {
			// move record-freeze to the end
			this.extensions.push(this.extensions.splice(n, 1));
		}

		this.extensions.map((extension) => {
			if (typeof extension == "function") {
				extension($);
			} else {
				require("./extensions/" + extension)($);
			}
		});

		return true;
	}

	unload(name) {
		if (this.ready) {
			throw new Error("Cannot unload extensions at this time");
		}

		let n = this.extensions.indexOf(name);

		if (n >= 0) {
			this.extensions.splice(n, 1);
		}
	}

	load(name) {
		if (this.ready) {
			if (typeof name == "function") {
				name(this);

				Object.keys(name).map((k) => {
					this.connection[k] = name[k];
				});
			} else {
				let o = require("./extensions/" + name);

				o(this);

				Object.keys(o).map((k) => {
					this.connection[k] = o[k];
				});
			}
		}

		let n = this.extensions.indexOf(name);

		if (n >= 0) {
			this.extensions.push(this.extensions.splice(n, 1));
		} else {
			this.extensions.push(name);
		}

		if (typeof name == "string") {
			let o = require("./extensions/" + name);

			Object.keys(o).map((k) => {
				this.connection[k] = o[k];
			});
		}
	}
}

exports.Extensions = Extensions;
