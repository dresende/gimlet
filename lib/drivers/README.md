## Drivers

Drivers should export a method `.create()` that will be called with 2 arguments:

1. `protocol`: **string** used in the connection protocol URI
2. `uri`: **mixed** string used instead of connection URI (or might be an object)

You should return an `object` (like a `Driver`). This object must have some methods:

- `open([cb])`: open connection to database
- `close([cb])`: close connection to database
- `query(...[,cb])`: query database
- `save(table, changes, conditions, cb)`: helper method to save record changes
- `remove(table, conditions, cb)`: helper method to remove record
