const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, addComment) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
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
      values: [id, userId, threadId, null, content, created, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(userId, threadId, commentId) {
    const commentResult = await this._pool.query({
      text: 'SELECT owner FROM comments WHERE thread_id = $1 AND id = $2',
      values: [threadId, commentId],
    });

    if (!commentResult.rowCount) {
      throw new NotFoundError(`comment tidak ditemukan atau tidak valid`);
    }

    if (commentResult.rows[0].owner !== userId) {
      throw new AuthorizationError('user bukan owner dari comment');
    }

    this._pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE thread_id = $1 AND id = $2',
      values: [threadId, commentId],
    });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT
        comments.id,
        users.username,
        comments.created AS date,
        comments.content,
        comments.is_delete
      FROM comments
      LEFT JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1
      AND comments.id LIKE 'comment-%'
      ORDER BY comments.created`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
