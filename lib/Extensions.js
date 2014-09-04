var util   = require("util");
var events = require("events");

exports.Extensions = Extensions;

function Extensions() {
	events.EventEmitter.call(this);

	this.extensions = [];
	this.ready      = false;
}

util.inherits(Extensions, events.EventEmitter);

Extensions.prototype.prepare = function () {
	if (this.ready) return false;

	this.ready = true;

	// special case: record-freeze
	var n = this.extensions.indexOf("record-freeze");

	if (n >= 0 && n < this.extensions.length - 1) {
		// move record-freeze to the end
		this.extensions.push(this.extensions.splice(n, 1));
	}

	for (var i = 0; i < this.extensions.length; i++) {
		if (typeof this.extensions[i] == "function") {
			this.extensions[i](this);
		} else {
			require("./extensions/" + this.extensions[i])(this);
		}
	}

	return true;
};

Extensions.prototype.unload = function (name) {
	if (this.ready) {
		throw new Error("Cannot unload extensions at this time");
	}

	var n = this.extensions.indexOf(name);

	if (n >= 0) {
		this.extensions.splice(n, 1);
	}
};

Extensions.prototype.load = function (name) {
	if (this.ready) {
		if (typeof name == "function") {
			name(this);
		} else {
			require("./extensions/" + name)(this);
		}
	}

	var n = this.extensions.indexOf(name);

	if (n >= 0) {
		this.extensions.push(this.extensions.splice(n, 1));
	} else {
		this.extensions.push(name);
	}
};
