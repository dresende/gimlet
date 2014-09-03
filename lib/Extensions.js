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
	if (this.ready) return;

	this.ready = true;

	for (var i = 0; i < this.extensions.length; i++) {
		if (typeof this.extensions[i] == "function") {
			this.extensions[i](this);
		} else {
			require("./extensions/" + this.extensions[i])(this);
		}
	}
};

Extensions.prototype.load = function (name) {
	var n = this.extensions.indexOf(name);

	if (n >= 0) {
		this.extensions.push(this.extensions.splice(n, 1));
	} else {
		this.extensions.push(name);
	}

	return this;
};
