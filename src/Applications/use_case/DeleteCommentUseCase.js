const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId) {
    const isCommentAvailable = await this._commentRepository
      .verifyCommentAvailability(commentId);
    if (!isCommentAvailable) {
      throw new NotFoundError('komentar tidak ditemukan atau tidak valid');
    }

    const isCommentOwner = await this._commentRepository.verifyCommentOwner(
      userId, commentId
    );
    if (!isCommentOwner) {
      throw new AuthorizationError('user bukan owner dari comment');
    }

    await this._commentRepository.deleteCommentById(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
