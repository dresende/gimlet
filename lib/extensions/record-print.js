module.exports = ($) => {
	$.on("record", (e) => {
		Object.defineProperty(e.record, "inspect", {
			enumerable : false,
			value      : () => (JSON.stringify(e.record, null, 4)),
		});
	});
};
