const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class GetThreadWithCommentsAndRepliesUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(
      threadId
    );

    if (thread === null) {
      throw new NotFoundError('thread tidak ditemukan atau tidak valid');
    }

    const commentsData = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const comments = [];
    for (let i=0; i < commentsData.length; i++) {
      const repliesData = await this._replyRepository.getRepliesByParentId(
        commentsData[i].id
      );

      const replies = [];
      for (let j=0; j < repliesData.length; j++) {
        replies.push(this.dataToReply(repliesData[j]));
      }

      comments.push(this.dataToComment(commentsData[i], replies));
    }

    return { ...thread, comments };
  }

  dataToComment({id, username, date, content, is_delete}, replies) {
    return {
      id,
      username,
      date,
      content: (is_delete === true ? '**komentar telah dihapus**' : content),
      replies,
    };
  };

  dataToReply({id, username, date, content, is_delete}) {
    return {
      id,
      username,
      date,
      content: (is_delete === true ? '**balasan telah dihapus**' : content),
    };
  };
}

module.exports = GetThreadWithCommentsAndRepliesUseCase;
