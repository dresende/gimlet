class Record {
	constructor(connection, data, props) {
		const changes = [];

		Object.keys(data).map((k) => {
			if (!data.hasOwnProperty(k)) return;

			if (props[k]?.type == "json") {
				if (typeof data[k] == "string" && [ "{", "[" ].includes(data[k][0])) {
					try {
						data[k] = JSON.parse(data[k]);
					} catch (e) {
						data[k] = {};
					}
				} else if (typeof data[k] == "string" && !data[k].length) {
					data[k] = {};
				} else if (data[k] === "true" || data[k] === "false") {
					data[k] = (data[k] === "true");
				} else if (data[k] === "null") {
					data[k] = null;
				}
			}

			Object.defineProperty(this, k, {
				enumerable   : true,
				configurable : true,
				get          : () => (data[k]),
				set          : (v) => {
					if (!Object.isFrozen(this)) {
						data[k] = v;
						return;
					}

					const new_value = props[k].validate(v);

					if (changes.indexOf(k) == -1 && new_value !== data[k]) {
						changes.push(k);
					}

					data[k] = new_value;
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
