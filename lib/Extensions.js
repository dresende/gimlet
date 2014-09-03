var util   = require("util");
var events = require("events");

exports.Extensions = Extensions;

function Extensions() {
	events.EventEmitter.call(this);
}

util.inherits(Extensions, events.EventEmitter);

Extensions.prototype.load = function (name) {
	if (typeof name == "function") {
		name(this);
	} else {
		require("./extensions/" + name)(this);
	}

	return this;
};
