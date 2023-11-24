# forum-api

Prerequisites:
- Node version 14.17.0 (managed by NVM/Node Version Manager, if possible).
- `.env` file that contains:
   - HOST
   - PORT
   - PGHOST
   - PGUSER
   - PGDATABASE
   - PGPASSWORD
   - PGPORT
   - PGHOST_TEST
   - PGUSER_TEST
   - PGDATABASE_TEST
   - PGPASSWORD_TEST
   - PGPORT_TEST
   - ACCESS_TOKEN_KEY
   - REFRESH_TOKEN_KEY
   - ACCCESS_TOKEN_AGE

To use required Node version (in .nvmrc), run `nvm use` (if NVM is available).

To install dependencies, run `npm install`.

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