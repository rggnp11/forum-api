/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    owner = 'user-123',
    threadId = 'thread-123',
    parentId = null,
    content = 'Comment content',
    created = '2023-01-01 00:00:00',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, owner, threadId, parentId, content, created, isDelete ],
    };

    await pool.query(query);
  },

  async addReply({
    id = 'reply-123',
    owner = 'user-123',
    threadId = 'thread-123',
    parentId = 'comment-123',
    content = 'Comment content',
    created = '2023-01-01 00:00:00',
    isDelete = false,
  }) {
    await this.addComment({
      id,
      owner,
      threadId,
      parentId,
      content,
      created,
      isDelete,
    });
  },

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT * FROM comments
        WHERE thread_id = $1 AND id LIKE 'comment-%'`,
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getRepliesByParentId(parentId) {
    const query = {
      text: `SELECT * FROM comments
        WHERE parent_id = $1 AND id LIKE 'reply-%'`,
      values: [parentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
