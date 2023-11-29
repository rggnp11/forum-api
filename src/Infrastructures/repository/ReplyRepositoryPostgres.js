const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(userId, threadId, parentId, addReply) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const created = new Date().toISOString().slice(0, 23).replace('T', ' ');

    const threadResult = await this._pool.query({
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    });

    if (!threadResult.rowCount) {
      throw new NotFoundError('thread tidak ada atau tidak valid');
    }

    const parentResult = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [parentId],
    });

    if (!parentResult.rowCount) {
      throw new NotFoundError('comment tidak ada atau tidak valid');
    }

    const query = {
      text: `INSERT INTO comments (
        id,
        owner,
        thread_id,
        parent_id,
        content,
        created,
        is_delete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, content, owner`,
      values: [id, userId, threadId, parentId, content, created, false],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(userId, threadId, parentId, replyId) {
    const replyResult = await this._pool.query({
      text: 'SELECT owner FROM comments WHERE thread_id = $1 AND parent_id = $2 AND id = $3',
      values: [threadId, parentId, replyId],
    });

    if (!replyResult.rowCount) {
      throw new NotFoundError(`reply tidak ada atau tidak valid`);
    }

    if (replyResult.rows[0].owner !== userId) {
      throw new AuthorizationError('user bukan owner dari reply');
    }

    this._pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE thread_id = $1 AND parent_id = $2 AND id = $3',
      values: [threadId, parentId, replyId],
    });
  }

  async getRepliesByParentId(parentId) {
    const query = {
      text: `SELECT
        comments.id,
        users.username,
        comments.created AS date,
        comments.content,
        comments.is_delete
      FROM comments
      LEFT JOIN users ON comments.owner = users.id
      WHERE comments.parent_id = $1
      AND comments.id LIKE 'reply-%'
      ORDER BY comments.created`,
      values: [parentId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
