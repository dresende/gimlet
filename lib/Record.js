exports.Record = Record;

function Record(con, data, props) {
	var data_changes = [];

	for (var k in data) {
		if (!data.hasOwnProperty(k)) continue;

		(function (o, k) {
			Object.defineProperty(o, k, {
				get: function () {
					return data[k];
				},
				set: function (v) {
					var new_value = props[k].validate(v);

					if (data_changes.indexOf(k) == -1 && new_value !== data[k]) {
						data_changes.push(k);
					}

					return data[k] = new_value;
				},
				enumerable : true
			});
		})(this, k);
	}

	Object.defineProperty(this, "remove", {
		value: function (next) {
			var updates = check_struct(data, data_changes, props);
			var table   = Object.keys(updates);
			var do_next = function (n) {
				if (n >= table.length) {
					if (next) next(null);
					return;
				}

				if (!updates[table[n]].id) return do_next(n + 1);

				con.remove(table[n], updates[table[n]].id, function (err) {
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

	Object.defineProperty(this, "save", {
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
				data[k] = props[k].validate(changes[k]);
			}

			var updates = check_struct(data, data_changes, props);
			var table   = Object.keys(updates);
			var do_next = function (n) {
				if (n >= table.length) {
					data_changes = [];

					if (next) next(null);
					return;
				}

				if (!updates[table[n]].id) return do_next(n + 1);
				if (!Object.keys(updates[table[n]].data).length) return do_next(n + 1);

				con.save(table[n], updates[table[n]].data, updates[table[n]].id, function (err) {
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
}

function check_struct(obj, changes, props) {
	var updates = {};

	for (var k in obj) {
		if (!obj.hasOwnProperty(k)) continue;
		if (!props[k]) continue;

		if (!updates[props[k].table]) {
			updates[props[k].table] = {
				id   : null,
				data : {}
			};
		}

		if (props[k].primary) {
			updates[props[k].table].id = {};
			updates[props[k].table].id[props[k].column] = obj[k];
		} else {
			if (changes.indexOf(k) == -1) continue;

			updates[props[k].table].data[props[k].column] = obj[k];
		}
	}

	return updates;
}
