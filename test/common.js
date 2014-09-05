var base_path = "..";

exports.gimlet = function () {
	return require(base_path);
};

exports.gimlet_settings = function () {
	return require(base_path + "/lib/Settings");
};

exports.gimlet_record = function () {
	return require(base_path + "/lib/Record");
};
