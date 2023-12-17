const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ToggleLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
  }

  async execute(userId, threadId, commentId) {
  }
}

module.exports = ToggleLikeUseCase;
