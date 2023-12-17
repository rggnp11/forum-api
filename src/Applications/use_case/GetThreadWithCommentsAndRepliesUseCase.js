const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class GetThreadWithCommentsAndRepliesUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
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

      const likeCount = await this._likeRepository.getLikeCountByCommentId(
        commentsData[i].id
      );

      comments.push(this.dataToComment(commentsData[i], replies, likeCount));
    }

    return { ...thread, comments };
  }

  dataToComment({id, username, date, content, is_delete}, replies, likeCount) {
    return {
      id,
      username,
      date,
      content: (is_delete === true ? '**komentar telah dihapus**' : content),
      replies,
      likeCount,
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
