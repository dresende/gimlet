var should = require("should");
var common = require("../common");
var Gimlet = common.gimlet();

describe("Cache", function () {
	var con   = null;

	before(function (done) {
		con   = Gimlet.connect("test://");
		con.loadExtensions();

		return done();
	});

	after(function (done) {
		con.close(done);
	});

	it("should be possible get from cache", function (done) {
		var cache = con.cache(function (id, next) {
			setImmediate(function () {
				var o = {};

				o.id   = id;
				o.name = "user" + id;

				return next(null, o);
			});
		});

		cache.get(123, function (err, user) {
			should.not.exist(err);

			user.should.have.property("id").of.type("number");
			user.id.should.eql(123);

			return done();
		});
	});

	it("should return anything the cache resolver returns", function (done) {
		var cache = con.cache(function (a, b, next) {
			setImmediate(function () {
				return next(new Error("whatever"), 123, b, a);
			});
		});

		cache.get([ 1, 2, 3 ], true, function (err, a, b, c) {
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

	it("should be able to create with options", function (done) {
		var cache = con.cache({ timeout: 1 }, function (id, next) {
			setImmediate(function () {
				return next(id);
			});
		});

		cache.get(333, function (id) {
			id.should.eql(333);

			return done();
		});
	});

	it("should be able to create with null options", function (done) {
		var cache = con.cache(null, function (id, next) {
			setImmediate(function () {
				return next(id);
			});
		});

		cache.get(333, function (id) {
			id.should.eql(333);

			return done();
		});
	});

	it("should not time out if not enough time as passed", function (done) {
		var cache = con.cache({ timeout: 1/*1s*/ }, function (id, next) {
			setImmediate(function () {
				return next(id);
			});
		});

		cache.get(333, function (id) {
			id.should.eql(333);

			setTimeout(function () {
				cache.cached(333).should.be.true;

				cache.get(333, function (id) {
					id.should.eql(333);

					return done();
				});
			}, 150);
		});
	});

	it("should time out if time as passed", function (done) {
		var cache = con.cache({ timeout: 0.1/*100ms*/ }, function (id, next) {
			setImmediate(function () {
				return next(id);
			});
		});

		cache.get(333, function (id) {
			id.should.eql(333);

			setTimeout(function () {
				cache.cached(333).should.not.be.true;

				cache.get(333, function (id) {
					id.should.eql(333);

					return done();
				});
			}, 150);
		});
	});

	it("should queue if calling more than once before cache resolves", function (done) {
		var cache = con.cache({ timeout: 0.1/*100ms*/ }, function (id, next) {
			setImmediate(function () {
				return next(id);
			});
		});

		cache.get(333, function (id) {
			id.should.eql(333);
		});

		cache.queued(333).should.be.true;

		cache.get(333, function (id) {
			id.should.eql(333);

			cache.queued(333).should.be.true;

			setImmediate(function () {
				cache.queued(333).should.not.be.true;
				return done();
			});
		});
	});
});
