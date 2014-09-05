var extension = module.exports = function () {};

extension.cache = function (opts, resolver) {
	if (typeof opts == "function") {
		resolver   = opts;
		opts = {};
	}
	return new Cache(opts || {}, resolver);
};

function Cache(opts, resolver) {
	var cache = {};
	var queue = {};
	var check_cache = function () {
		var dt = Date.now();

		for (var k in cache) {
			if (cache[k].e > dt) continue;

			delete cache[k];
		}
	};

	if (!opts.hasOwnProperty("timeout")) {
		opts.timeout = null;
	}

	return {
		cached: function () {
			var key = Array.prototype.join.call(arguments, "|");

			return cache.hasOwnProperty(key) && (cache[key].e === null || cache[key].e > Date.now());
		},
		queued: function () {
			return queue.hasOwnProperty(Array.prototype.join.call(arguments, "|"));
		},
		get: function () {
			var args = Array.prototype.slice.apply(arguments);
			var next = args.pop();
			var key  = args.join("|");

			if (cache.hasOwnProperty(key)) {
				if (cache[key].e !== null && cache[key].e <= Date.now()) {
					// expired
					delete cache[key];
				} else {
					next.apply(null, cache[key].a);
					return this;
				}
			}

			if (queue.hasOwnProperty(key)) {
				queue[key].push(next);
				return this;
			}

			queue[key] = [ next ];

			args.push(function () {
				var args = Array.prototype.slice.apply(arguments);

				cache[key] = {
					a : args,
					e : (opts.timeout === null ? null : Date.now() + (opts.timeout * 1000))
				};

				for (var i = 0; i < queue[key].length; i++) {
					queue[key][i].apply(null, cache[key].a);
				}

				delete queue[key];

				if (opts.timeout !== null) {
					check_cache();
				}
			});

			resolver.apply(null, args);
			return this;
		}
	};
}
