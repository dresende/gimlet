var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Cache", () => {
	var con   = null;

	before((done) => {
		con   = Gimlet.connect("test://");
		con.use("cache");

		return done();
	});

	after((done) => {
		con.close(done);
	});

	it("should be possible get from cache", (done) => {
		var cache = con.cache((id, next) => {
			setImmediate(() => {
				var o = {};

				o.id   = id;
				o.name = "user" + id;

				return next(null, o);
			});
		});

		cache.get(123, (err, user) => {
			should.not.exist(err);

			user.should.have.property("id").of.type("number");
			user.id.should.eql(123);

			return done();
		});
	});

	it("should return anything the cache resolver returns", (done) => {
		var cache = con.cache((a, b, next) => {
			setImmediate(() => {
				return next(new Error("whatever"), 123, b, a);
			});
		});

		cache.get([ 1, 2, 3 ], true, (err, a, b, c) => {
			should.exist(err);
			should.exist(a);
			should.exist(b);
			should.exist(c);
			a.should.eql(123);
			b.should.eql(true);
			c.should.eql([ 1, 2, 3 ]);

			return done();
		});
	});

	it("should be able to create with options", (done) => {
		var cache = con.cache({ timeout: 1 }, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);

			return done();
		});
	});

	it("should be able to create with null options", (done) => {
		var cache = con.cache(null, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);

			return done();
		});
	});

	it("should not time out if not enough time as passed", (done) => {
		var cache = con.cache({ timeout: 1/*1s*/ }, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);

			setTimeout(() => {
				cache.cached(333).should.be.true;

				cache.get(333, (id) => {
					id.should.eql(333);

					return done();
				});
			}, 150);
		});
	});

	it("should time out if time as passed", (done) => {
		var cache = con.cache({ timeout: 0.1/*100ms*/ }, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);

			setTimeout(() => {
				cache.cached(333).should.not.be.true;

				cache.get(333, (id) => {
					id.should.eql(333);

					return done();
				});
			}, 150);
		});
	});

	it("should queue if calling more than once before cache resolves", (done) => {
		var cache = con.cache({ timeout: 0.1/*100ms*/ }, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);
		});

		cache.queued(333).should.be.true;

		cache.get(333, (id) => {
			id.should.eql(333);

			cache.queued(333).should.be.true;

			setImmediate(() => {
				cache.queued(333).should.not.be.true;
				return done();
			});
		});
	});

	it("should clean other caches after check", (done) => {
		var cache = con.cache({ timeout: 0.1/*100ms*/ }, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);
		});

		setTimeout(() => {
			cache.get(444, (id) => {
				id.should.eql(444);

				setImmediate(() => {
					cache.cached(333).should.be.false;

					return done();
				});
			});
		}, 150);
	});

	it("should bypass other caches after check", (done) => {
		var cache = con.cache({}, (id, next) => {
			setImmediate(() => {
				return next(id);
			});
		});

		cache.get(333, (id) => {
			id.should.eql(333);
		});

		setTimeout(() => {
			cache.get(444, (id) => {
				id.should.eql(444);

				setImmediate(() => {
					cache.cached(333).should.be.true;

					return done();
				});
			});
		}, 150);
	});

	it("should be fully loaded just before querying", (done) => {
		con.query("users", () => {
			return done();
		});
	});
});

describe("Cache", () => {
	var con   = null;

	before((done) => {
		con   = Gimlet.connect("test://");

		return done();
	});

	after((done) => {
		con.close(done);
	});

	it("can be loaded after extensions are prepared", (done) => {
		should.not.exist(con.cache);

		con.query("users", () => {
			con.use("cache");

			con.should.have.property("cache").of.type("function");

			return done();
		});
	});
});
