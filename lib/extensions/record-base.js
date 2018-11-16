module.exports = ($) => {
	let throws = (err) => {
		if (err) throw err;
	};

	$.on("record", (e) => {
		Object.defineProperty(e.record, "remove", {
			value: (next = throws) => {
				let updates = check_struct(e);
				let table   = Object.keys(updates);
				let do_next = (n) => {
					if (n >= table.length) return next();

					if (!updates[table[n]].id) {
						// return do_next(n + 1);
						return next(new Error(table[n] + " cannot be removed, no ID found"));
					}

					$.connection.remove(table[n], updates[table[n]].id, (err) => {
						if (err) return next(err);

						return do_next(n + 1);
					});
				};

				return do_next(0);
			}
		});

		Object.defineProperty(e.record, "save", {
			value: (...args) => {
				let changes = {};
				let next    = throws;

				args.map((arg) => {
					switch (typeof arg) {
						case "object":
							changes = arg;
							break;
						case "function":
							next = arg;
							break;
					}
				});

				Object.keys(changes).map((k) => {
					e.record[k] = e.props[k].validate(changes[k]);
				});

				let updates = check_struct(e);
				let table   = Object.keys(updates);
				let do_next = (n) => {
					if (n >= table.length) {
						e.changes = [];

						return next();
					}

					if (!Object.keys(updates[table[n]].data).length) {
						return do_next(n + 1);
					}

					if (!updates[table[n]].id) {
						// return do_next(n + 1);
						return next(new Error(table[n] + " cannot be saved, no ID found"));
					}

					$.connection.save(table[n], updates[table[n]].data, updates[table[n]].id, (err) => {
						if (err) return next(err);

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
	let updates = {};

	Object.keys(e.data).map((k) => {
		if (!e.data.hasOwnProperty(k)) return;
		if (!e.props[k]) return;

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
			if (e.changes.indexOf(k) == -1) return;

			updates[e.props[k].table].data[e.props[k].column] = e.data[k];
		}
	});

	return updates;
}
