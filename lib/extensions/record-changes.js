module.exports = function ($) {
	$.on("record", function (e) {
		if (!e.data.hasOwnProperty("changes")) {
			Object.defineProperty(e.record, "changes", {
				enumerable : false,
				value      : function () {
					var changes = {};

					e.changes.map(function (change) {
						changes[change] = e.data[change];
					});

					return changes;
				}
			});
		}
		if (!e.data.hasOwnProperty("changed")) {
			Object.defineProperty(e.record, "changed", {
				enumerable : false,
				value      : function () {
					return (e.changes.length > 0);
				}
			});
		}
	});
};
