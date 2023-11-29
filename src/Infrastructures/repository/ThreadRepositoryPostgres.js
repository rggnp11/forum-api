const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, addThread) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const created = new Date().toISOString().slice(0, 23).replace('T', ' ');

    const query = {
      text: `INSERT INTO threads (id, owner, title, body, created)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, owner`,
      values: [id, userId, title, body, created],
    };

    const result = await this._pool.query(query); 

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(threadId) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    });

    return rowCount > 0;
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT
        threads.id,
        threads.title,
        threads.body,
        threads.created AS date,
        users.username
      FROM threads
      LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return { ...rows[0] };
  }
}

module.exports = ThreadRepositoryPostgres;
