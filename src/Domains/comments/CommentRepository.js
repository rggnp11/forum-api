class CommentRepository {
    async addComment(userId, threadId, addComment) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteCommentById(userId, threadId, commentId) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
    async getCommentsByThreadId(threadId) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  }
  
  module.exports = CommentRepository;
  