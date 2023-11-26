const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, parentId, addReplyPayload) {
    const addReply = new AddReply(addReplyPayload);
    return await this._replyRepository.addReply(userId, threadId, parentId, addReply);
  }
}

module.exports = AddReplyUseCase;
