const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    owner = 'user-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3)',
      values: [id, owner, commentId],
    };

    await pool.query(query);
  },

  async getLikesCountByCommentId(commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const { rowCount } = await pool.query(query);

    return rowCount;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
