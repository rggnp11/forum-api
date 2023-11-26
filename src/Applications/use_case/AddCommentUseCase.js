const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, addCommentPayload) {
    const addComment = new AddComment(addCommentPayload);
    return await this._commentRepository.addComment(userId, threadId, addComment);
  }
}

module.exports = AddCommentUseCase;
