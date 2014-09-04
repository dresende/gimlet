exports.extend = function (opts) {
	opts = opts || {};

	merge(opts, exports.defaults);

	return opts;
};

exports.defaults = {
	extensions : [ "cache", "record-base", "record-changes", "record-freeze" ]
};

function merge(ext, base) {
	for (var k in base) {
		if (ext.hasOwnProperty(k)) continue;

		ext[k] = base[k];
	}
}
