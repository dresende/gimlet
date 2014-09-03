module.exports = function ($) {
	$.on("record", function (e) {
		console.log("record-changes..");
		if (!e.data.hasOwnProperty("changes")) {
			Object.defineProperty(e.record, "changes", {
				value: function () {
					var changes = {};

					e.changes.map(function (change) {
						changes[change] = e.data[change];
					});

					return changes;
				}
			});
		}
	});
};
