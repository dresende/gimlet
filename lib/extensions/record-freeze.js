module.exports = ($) => {
	$.on("record", (e) => {
		Object.freeze(e.record);
	});
};
