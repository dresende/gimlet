let extension = module.exports = function () {};

extension.cache = function (opts, resolver) {
	if (typeof opts == "function") {
		resolver   = opts;
		opts = {};
	}
	return new Cache(opts || {}, resolver);
};

function Cache(opts, resolver) {
	let cache       = {};
	let queue       = {};
	let check_cache = () => {
		let dt = Date.now();

		Object.keys(cache).filter((k) => (cache[k].e <= dt)).map((k) => {
			delete cache[k];
		});
	};

	if (!opts.hasOwnProperty("timeout")) {
		opts.timeout = null;
	}

	return {
		cached: (...args) => {
			let key = args.join("|");

			return cache.hasOwnProperty(key) && (cache[key].e === null || cache[key].e > Date.now());
		},
		queued: (...args) => {
			return queue.hasOwnProperty(args.join("|"));
		},
		get: (...args) => {
			let next = args.pop();
			let key  = args.join("|");

			if (cache.hasOwnProperty(key)) {
				if (cache[key].e !== null && cache[key].e <= Date.now()) {
					// expired
					delete cache[key];
				} else {
					next(...cache[key].a);

					return this;
				}
			}

			if (queue.hasOwnProperty(key)) {
				queue[key].push(next);
				return this;
			}

			queue[key] = [ next ];

			args.push((...args) => {
				cache[key] = {
					a : args,
					e : (opts.timeout === null ? null : Date.now() + (opts.timeout * 1000))
				};

				queue[key].map((next) => {
					next(...cache[key].a);
				});

				delete queue[key];

				if (opts.timeout !== null) {
					check_cache();
				}
			});

			resolver(...args);

			return this;
		}
	};
}
