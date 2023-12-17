const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes (id, owner, comment_id) VALUES ($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyLikeAvailability(userId, commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount > 0;
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: `SELECT id FROM likes WHERE comment_id = $1`,
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
