# forum-api

### Prerequisites:

- Node version **14.17.0** (managed by NVM/Node Version Manager, if possible).

- `.env` file that contains:
   - `HOST`
   - `PORT`
   - `PGHOST`
   - `PGUSER`
   - `PGDATABASE`
   - `PGPASSWORD`
   - `PGPORT`
   - `PGHOST_TEST`
   - `PGUSER_TEST`
   - `PGDATABASE_TEST`
   - `PGPASSWORD_TEST`
   - `PGPORT_TEST`
   - `ACCESS_TOKEN_KEY`
   - `REFRESH_TOKEN_KEY`
   - `ACCCESS_TOKEN_AGE`

- PostgreSQL with two databases specified in `PGDATABASE` and `PGDATABASE_TEST` of the `.env` file. The default databases are:
   - `forumapi`
   - `forumapi_test`

### Setting up

- Run `nvm use` if NVM is available to use required Node version *(in .nvmrc)*.
- Run `npm install` to install dependencies.
- Run `npm run migrate up` and `npm run migrate:test up` to apply migrations to the main and test database.

### Running tests

- Run `npm run test` or `npm run test:watch` to run tests.

### Starting server

- Run `npm start:dev` or `npm start` to start the server in development or production respectiveliy.

### Other migration commands

- `npm run migrate create ‘<migration name>’` to create new migration file.
- `npm run migrate up` to run up migration which has not been applied.
- `npm run migrate down` to run down migration from current state.
- `npm run migrate redo` to rerun previous migration (to run down migration, then up migration).
