class GetThreadWithCommentsAndRepliesUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(
      threadId
    );
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    for (let i=0; i < comments.length; i++) {
      const replies = await this._replyRepository.getRepliesByParentId(
        comments[i].id
      );
      comments[i].replies = replies;
    }

    thread.comments = comments;

    return { ...thread };
  }
}

module.exports = GetThreadWithCommentsAndRepliesUseCase;
