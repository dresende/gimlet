exports.Property = Property;

function Property(name, opts) {
	return {
		column   : name,
		table    : opts.table,
		primary  : opts.primary || false,
		validate : (val) => {
			if (opts.notNull && val == null) {
				throw new TypeError(name + " cannot be null");
			}
			if (opts.primary && val != null) {
				throw new Error(name + " cannot be changed");
			}

			switch (opts.type) {
				case "number":
					val = +val;

					if (typeof val != "number" || isNaN(val)) {
						throw new TypeError(name + " should be a number");
					}

					return val;
				case "text":
					return "" + val;
			}

			return val;
		}
	};
}
