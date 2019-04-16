var base_path = "..";

exports.gimlet = function () {
	return require(base_path);
};

exports.gimlet_settings = function () {
	return require(base_path + "/lib/Settings");
};

exports.gimlet_types = function () {
	return require(base_path + "/lib/Types");
};

exports.gimlet_record = function () {
	return require(base_path + "/lib/Record");
};
