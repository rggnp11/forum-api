# forum-api

Dicoding Example Authentication API Project

To run database migration:
   - `npm run migrate create ‘<migration name>’` to create new migration file.
   - `npm run migrate up` to run up migration which has not been applied.
   - `npm run migrate down` to run down migration from current state.
   - `npm run migrate redo` to rerun previous migration (to run down migration, then up migration).

To run database migration test:
   - `npm run migrate:test up` to run up migration which has not been applied on the test database.

To run test:
   - `npm run test` to run test.
   - `npm run test:watch` to run test continuously.