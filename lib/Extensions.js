var util   = require("util");
var events = require("events");

exports.Extensions = Extensions;

function Extensions() {
	events.EventEmitter.call(this);
}

util.inherits(Extensions, events.EventEmitter);

Extensions.prototype.load = function (name) {
	require(__dirname + "/extensions/" + name)(this);
};
