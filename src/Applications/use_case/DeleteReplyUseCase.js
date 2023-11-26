class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, parentId, replyId) {
    await this._replyRepository.deleteReplyById(userId, threadId, parentId, replyId);
  }
}

module.exports = DeleteReplyUseCase;
