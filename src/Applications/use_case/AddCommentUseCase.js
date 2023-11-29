const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, addCommentPayload) {
    const addComment = new AddComment(addCommentPayload);

    const threadAvailable = await this._threadRepository
      .verifyThreadAvailability(threadId);
    if (!threadAvailable) {
      throw new NotFoundError('thread tidak ditemukan atau tidak valid');
    }

    return await this._commentRepository.addComment(
      userId, threadId, addComment
    );
  }
}

module.exports = AddCommentUseCase;
