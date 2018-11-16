module.exports = ($) => {
	$.on("record", (e) => {
		if (!e.data.hasOwnProperty("changes")) {
			Object.defineProperty(e.record, "changes", {
				enumerable : false,
				value      : () => {
					let changes = {};

					e.changes.map((change) => {
						changes[change] = e.data[change];
					});

					return changes;
				}
			});
		}
		if (!e.data.hasOwnProperty("changed")) {
			Object.defineProperty(e.record, "changed", {
				enumerable : false,
				value      : () => {
					return (e.changes.length > 0);
				}
			});
		}
	});
};
