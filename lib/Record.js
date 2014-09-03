exports.Record = Record;

function Record(connection, data, props) {
	var changes = [];

	for (var k in data) {
		if (!data.hasOwnProperty(k)) continue;

		(function (o, k) {
			Object.defineProperty(o, k, {
				get: function () {
					return data[k];
				},
				set: function (v) {
					var new_value = props[k].validate(v);

					if (changes.indexOf(k) == -1 && new_value !== data[k]) {
						changes.push(k);
					}

					return data[k] = new_value;
				},
				enumerable : true
			});
		})(this, k);
	}

	connection.extensions.emit("record", {
		connection : connection,
		record     : this,
		data       : data,
		props      : props,
		changes    : changes
	});
}
