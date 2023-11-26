class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._commentRepository.deleteCommentById(userId, threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
