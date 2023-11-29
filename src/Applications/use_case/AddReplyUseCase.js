const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, parentId, addReplyPayload) {
    const addReply = new AddReply(addReplyPayload);

    const isThreadAvailable = await this._threadRepository
      .verifyThreadAvailability(threadId);
    if (!isThreadAvailable) {
      throw new NotFoundError('thread tidak ditemukan atau tidak valid');
    }

    const isCommentAvailable = await this._commentRepository
      .verifyCommentAvailability(parentId);
    if (!isCommentAvailable) {
      throw new NotFoundError('comment tidak ditemukan atau tidak valid');
    }
    
    return await this._replyRepository.addReply(
      userId, threadId, parentId, addReply
    );
  }
}

module.exports = AddReplyUseCase;
