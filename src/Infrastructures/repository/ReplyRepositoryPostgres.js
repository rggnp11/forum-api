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

  async deleteReplyById(threadId, parentId, replyId) {
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
