const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ToggleLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId, commentId) {
    const isThreadAvailable = await this._threadRepository
      .verifyThreadAvailability(threadId);

    if (!isThreadAvailable) {
      throw new NotFoundError('thread tidak ditemukan atau tidak valid');
    }

    const isCommentAvailable = await this._commentRepository
      .verifyCommentAvailability(commentId);

    if (!isCommentAvailable) {
      throw new NotFoundError('komentar tidak ditemukan atau tidak valid');
    }

    const isLikeAvailable = await this._likeRepository
      .verifyLikeAvailability(userId, commentId);

    if (!isLikeAvailable) {
      await this._likeRepository.addLike(userId, commentId);
    } else {
      await this._likeRepository.deleteLikeByCommentId(userId, commentId);
    }
  }
}

module.exports = ToggleLikeUseCase;
