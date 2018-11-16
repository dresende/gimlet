var util = require("util");

module.exports = function ($) {
	$.on("record", function (e) {
		Object.defineProperty(e.record, "inspect", {
			value: function () {
				return JSON.stringify(e.record, null, 4);
			}
		});
	});
};
