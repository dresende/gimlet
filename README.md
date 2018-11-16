## Gimlet

[![Build Status](https://api.travis-ci.org/dresende/gimlet.svg?branch=master)](http://travis-ci.org/dresende/gimlet)
[![Coverage Status](https://img.shields.io/coveralls/dresende/gimlet.svg)](https://coveralls.io/r/dresende/gimlet?branch=master)
[![Published Version](https://badge.fury.io/js/gimlet.svg)](https://npmjs.org/package/gimlet)

Gimlet is a NodeJS module for database access built on top of commonly used database drivers. It gives some high level validations and helper methods on top of returned rows. This is not an ORM/ODM, queries must still be made by hand (more or less..).

### Installation

Gimlet is available on NPM.

```sh
npm install gimlet
```

Since gimlet uses other drivers you must install the ones you need separately. For mysql just do:

```sh
npm install mysql
```

#### Drivers

Driver | Package
-------|--------
mysql  | mysql

#### Driver Registration

If you want to use another package to access the same database type, you can register the package.

```js
var gimlet = require("gimlet");

gimlet.register("mysql2", "mysql"); // will use mysql2 package with mysql integration

gimlet.connect("mysql2://...");
```

### Usage

```js
var gimlet = require("gimlet");
var con    = gimlet.connect("mysql://....");

con.handler().query("SELECT * FROM users", function (err, users) {
    // this is where the differences from the driver appear
    console.log(users);
});
```

### API

#### Connection

When you use `gimlet.connect()` you get a `Connection` instance.

##### handler()

Get a context isolation for possible transactions. This call is synchronous and returns an API to access the database using the connection pool.

###### handler().query(...[, cb])

Query the database, just like you do with the low level driver. Returned rows should be doped with features.

###### handler().queryRow(...[, cb])

Similar to `query` but returns only the first row of the results.

###### handler().queryOne(...[, cb])

Similar to `query` but returns only the first column of the first row of the results.

###### handler().create(table, data[, cb])

Just a shortcut to an INSERT query. `data` should be an object with the properties and values you want.

###### handler().remove(table, conditions[, cb])

Just a shortcut to a DELETE query. `conditions` should be an object.

###### handler().close([cb])

Close connection.

##### open([cb])

Open connection to database. Some drivers do not connect immediately so you need to call this if you want an immediate connection. MySQL for example connects on first query.

#### Record

When calling `connection.query()`, returned rows should be instances of `Record` instead of plain objects. Records usually are extended with some base plugins (and perhaps external plugins). By default, a `Record` will be extended with `record-base`, `record-changes` and `record-freeze` that will give you the methods below.

##### save([changes[, cb]])

Save record modifications. You can pass a `changes` object with a few more changes before saving.

##### remove([cb])

Remove record from database.

##### changes()

Returns an object with the changes detected on the record.

##### changed()

Returns a boolean indicating if the record has been changed or not.

### Extensions

Some extensions are loaded by default, you can create and load others if you need. The syntax is similar to Express and others.

```js
var Gimlet = require("gimlet");
var con    = Gimlet.connect("test://");

con.use("cache"); // use built-in cache extension
con.cease("record-freeze"); // stop using built-in record freezing
```

#### cache

This is an extension that gives a `Connection` the ability to create simple asynchronous caches.

```js
var Gimlet = require("gimlet");
var con    = Gimlet.connect("mysql://username:password@hostname/database");

con.use("cache");
var userCache = con.cache(function (id, next) {
    con.queryRow("SELECT * FROM users WHERE id = ?", [ id ], next);
});

/**
 * This will not trigger 2 queries, only one. The second will queue
 * and wait for the first to return (because the `id` requested is
 * the same).
 **/
userCache.get(1, function (err, user) {
    console.log(err, user);
});
userCache.get(1, function (err, user) {
    console.log(err, user);
});
```

#### record-base

This extensions is the one responsible for creating the `Record.save` and `Record.remove` methods.

#### record-changes

This extension is the one responsible for creating the `Record.changes` and `Record.changed` methods.

#### record-freeze

This extension just freezes the object. It just calls `Object.freeze`. This is a special case since, if detected in the extensions list, it will be moved to the end of the load process to avoid freezing objects before all the necessary changes.
