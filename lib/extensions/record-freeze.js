module.exports = function ($) {
	$.on("record", function (e) {
		Object.freeze(e.record);
	});
};
