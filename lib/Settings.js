module.exports = function (opts) {
	opts = opts || {};

	merge(opts, exports.defaults);

	return opts;
};

exports.defaults = {
	extensions : [ "record-base" ]
};

function merge(ext, base) {
	for (var k in base) {
		if (!ext.hasOwnProperty(k)) {
			ext[k] = base[k];
			continue;
		}

		if (typeof ext[k] == "object" && typeof base[k] == "object" && !Array.isArray(base[k])) {
			merge(ext[k], base[k]);
		}
	}
}
