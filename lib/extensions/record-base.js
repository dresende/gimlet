module.exports = function ($) {
	$.on("record", function (e) {
		Object.defineProperty(e.record, "remove", {
			value: function (next) {
				var updates = check_struct(e);
				var table   = Object.keys(updates);
				var do_next = function (n) {
					if (n >= table.length) {
						if (next) next(null);
						return;
					}

					if (!updates[table[n]].id) return do_next(n + 1);

					$.connection.remove(table[n], updates[table[n]].id, function (err) {
						if (err) {
							if (next) {
								next(err);
							} else {
								throw err;
							}
							return;
						}

						return do_next(n + 1);
					});
				};

				do_next(0);
				return null;
			}
		});

		Object.defineProperty(e.record, "save", {
			value: function () {
				var changes = {};
				var next    = null;

				for (var i = 0; i < arguments.length; i++) {
					switch (typeof arguments[i]) {
						case "object":
							changes = arguments[i];
							break;
						case "function":
							next = arguments[i];
							break;
					}
				}

				for (var k in changes) {
					e.record[k] = e.props[k].validate(changes[k]);
				}

				var updates = check_struct(e);
				var table   = Object.keys(updates);
				var do_next = function (n) {
					if (n >= table.length) {
						data_changes = [];

						if (next) next(null);
						return;
					}

					if (!Object.keys(updates[table[n]].data).length) return do_next(n + 1);
					if (!updates[table[n]].id) {
						// return do_next(n + 1);
						return next(new Error(table[n] + " cannot be saved, no ID found"));
					}

					$.connection.save(table[n], updates[table[n]].data, updates[table[n]].id, function (err) {
						if (err) {
							if (next) {
								next(err);
							} else {
								throw err;
							}
							return;
						}

						return do_next(n + 1);
					});
				};

				do_next(0);

				return this;
			}
		});
	});
};

function check_struct(e) {
	var updates = {};

	for (var k in e.data) {
		if (!e.data.hasOwnProperty(k)) continue;
		if (!e.props[k]) continue;

		if (!updates[e.props[k].table]) {
			updates[e.props[k].table] = {
				id   : null,
				data : {}
			};
		}

		if (e.props[k].primary) {
			updates[e.props[k].table].id = {};
			updates[e.props[k].table].id[e.props[k].column] = e.data[k];
		} else {
			if (e.changes.indexOf(k) == -1) {
				continue;
			}

			updates[e.props[k].table].data[e.props[k].column] = e.data[k];
		}
	}

	return updates;
}
