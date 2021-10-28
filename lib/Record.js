class Record {
	constructor(connection, data, props) {
		let changes = [];

		Object.keys(data).map((k) => {
			if (!data.hasOwnProperty(k)) return;

			Object.defineProperty(this, k, {
				enumerable   : true,
				configurable : true,
				get          : () => (data[k]),
				set          : (v) => {
					if (!Object.isFrozen(this)) {
						return data[k] = v;
					}

					let new_value = props[k].validate(v);

					if (changes.indexOf(k) == -1 && new_value !== data[k]) {
						changes.push(k);
					}

					return data[k] = new_value;
				},
			});
		});

		connection.extensions.emit("record", {
			record     : this,
			data       : data,
			props      : props,
			changes    : changes
		});
	}
}

exports.Record = Record;
