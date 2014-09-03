## Gimlet

[![Build Status](https://api.travis-ci.org/dresende/gimlet.svg?branch=master)](http://travis-ci.org/dresende/gimlet)
[![Coverage Status](https://img.shields.io/coveralls/dresende/gimlet.svg)](https://coveralls.io/r/dresende/gimlet?branch=master)
[![Published Version](https://badge.fury.io/js/gimlet.svg)](https://npmjs.org/package/gimlet)
[![Dependencies](https://gemnasium.com/dresende/gimlet.png)](https://gemnasium.com/dresende/gimlet)

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

con.query("SELECT * FROM users", function (err, users) {
    // this is where the differences from the driver appear
    console.log(users);
});
```

### API

#### Connection

When you use `gimlet.connect()` you get a `Connection` instance.

##### query(...[, cb])

Query the database, just like you do with the low level driver. High level drivers should intercept the callback and create the Records appropriately.

##### open([cb])

Open connection to database. Some drivers do not connect immediately so you need to call this if you want an immediate connection. MySQL for example connects on first query.

##### close([cb])

Close connection.

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
