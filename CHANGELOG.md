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
