const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, parentId, replyId) {
    const isReplyAvailable = await this._replyRepository
      .verifyReplyAvailability(replyId);
    if (!isReplyAvailable) {
      throw new NotFoundError('balasan tidak ditemukan atau tidak valid');
    }

    const isReplyOwner = await this._replyRepository.verifyReplyOwner(
      userId, replyId
    );
    if (!isReplyOwner) {
      throw new AuthorizationError('user bukan owner dari balasan');
    }

    await this._replyRepository.deleteReplyById(threadId, parentId, replyId);
  }
}

module.exports = DeleteReplyUseCase;
