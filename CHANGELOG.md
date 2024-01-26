## 1.13.0 - 26 Jan 2024

- drivers:
  - mysql: fixes transaction rollback not being fully async

## 1.12.0 - 25 Jan 2024

- connection:
  - fixes url is not an object before parsing
- drivers:
  - mysql: fixes transaction returning a connection instead of API reference

## 1.11.0 - 22 Nov 2023

- ci:
  - rebuilds npm shrinkwrap without wrong dependencies

## 1.10.5 - 21 Nov 2023

- connection:
  - fixes password being encoded and not properly passed to mysql

## 1.10.4 - 21 Nov 2023

- connection:
  - changes driver creation to parse url and pass options

## 1.10.3 - 21 Nov 2023

- changes connection parsing to use WHATWG URL object instead of url.parse
- deps:
  - [glob@10.3.10](https://www.npmjs.com/package/glob)

## 1.10.2 - 25 Sep 2023

- drivers:
  - mysql: removes unnecessary code blocks
- deps:
  - [glob@10.3.6](https://www.npmjs.com/package/glob)

## 1.10.1 - 10 Jul 2023

- deps:
  - [glob@10.3.3](https://www.npmjs.com/package/glob)

## 1.10.0 - 4 Jul 2023

- mysql:
  - adds warning when calling query*() with at least 2 trailing functions instead of just 1
- ci:
  - adds eslint workflow
- deps:
  - [glob@10.3.1](https://www.npmjs.com/package/glob)

## 1.9.0 - 19 Apr 2023

- deps:
  - [glob@10.2.1](https://www.npmjs.com/package/glob)

## 1.8.2 - 24 Mar 2023

- deps:
  - mocha@10.2.0
  - glob@9.3.2

## 1.8.1 - 7 Jul 2022

- ci:
  - updates npm shrinkwrap to avoid dev
  - codeql-analysis: updates to v2
  - codeql-analysis: removes unnecessary step

## 1.8.0 - 6 Jul 2022

- deps:
  - mocha@10.0.0
  - glob@8.0.3
  - nyc@15.1.0
  - removes deprecated istanbul@0.4.5

## 1.7.1 - 17 Jan 2022

- deps:
  - mocha@9.1.4

## 1.7.0 - 28 Oct 2021

- fixes bad whitespace
- record: fixes throwing on validation when record is not frozen

## 1.6.5 - 13 Jul 2021

- mysql:
  - nodeadds support for async/await without changing API
- deps:
  - mocha@9.1.3
  - glob@7.2.0

## 1.6.4 - 13 Jul 2021

- deps:
  - mocha@9.0.2
  - glob@7.1.7

## 1.6.3 - 17 Mar 2021

- mysql:
  - exposes connection()
- deps:
  - mocha@8.3.2

## 1.6.2 - 09 Nov 2020

- deps:
  - mocha@8.2.1

## 1.6.1 - 19 Oct 2020

- deps:
  - mocha@8.2.0

## 1.6.0 - 09 Oct 2020

- mysql:
  - changes Point class to have public x/y
  - changes errors messages from commit/rollback to be able to distinguish them
- deps:
  - mocha@8.1.3

## 1.5.2 - 25 May 2020

- deps:
  - mocha@7.1.2
  - glob@7.1.6

## 1.5.1 - 05 Dec 2019

- mysql:
  - stores last query to give a proper error when pool connection is held for some time
  - exposes escape and escapeId
- deps:
  - glob@7.1.6
  - mocha@6.2.2

## 1.5.0 - 18 Sep 2019

- removes sqlstring dependency and exposes a Point class with .toSqlString()

## 1.4.0 - 12 Sep 2019

- mysql: fixes looking at objects and not checking if null/undefined

## 1.3.0 - 12 Sep 2019

- travis:
  - removes node 6 and adds node 12
- deps:
  - sqlstring@2.3.1

## 1.2.0 - 25 Jul 2019

- adds async/await versions of query*() called fetch*()
- deps:
  - mocha@6.2.0

## 1.1.2 - 09 May 2019

- deps:
  - glob@7.1.4

## 1.1.1 - 21 Apr 2019

- deps:
  - mocha@6.1.4

## 1.1.0 - 16 Apr 2019

- adds types (point and polygon)

## 1.0.5 - 13 Apr 2019

- deps:
  - mocha@6.1.3

## 1.0.4 - 25 Feb 2019

- deps:
  - mocha@6.0.1

## 1.0.3 - 20 Feb 2019

- deps:
  - mocha@6.0.0

## 1.0.2 - 16 Nov 2018

- mysql: fixes this.query instead of $.query

## 1.0.1 - 16 Nov 2018

- Avoid deprecation warning in node 10

## 1.0.0 - 16 Nov 2018

- First really stable version
