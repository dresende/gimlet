exports.extend = (opts) => {
	opts = opts || {};

	Object.keys(exports.defaults).map((k) => {
		if (!opts.hasOwnProperty(k)) {
			opts[k] = exports.defaults[k];
		}
	});

	return opts;
};

exports.defaults = {
	extensions     : [ "record-base", "record-print", "record-changes", "record-freeze" ],
	debug          : false,
	releaseTimeout : 300
};
