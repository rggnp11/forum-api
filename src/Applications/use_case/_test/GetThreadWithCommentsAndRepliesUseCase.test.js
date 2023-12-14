const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadWithCommentsAndRepliesUseCase = require('../GetThreadWithCommentsAndRepliesUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('GetThreadWithCommentsAndRepliesUseCase', () => {
  it('should throw NotFoundError when thread not exist', async() => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(
      () => Promise.resolve(null)
    );
    
    /** creating use case instance */
    const getThreadWithCommentsAndRepliesUseCase =
      new GetThreadWithCommentsAndRepliesUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: new CommentRepository(),
        replyRepository: new ReplyRepository(),
      });
    
    // Action & Assert
    expect(getThreadWithCommentsAndRepliesUseCase.execute('thread-123'))
      .rejects
      .toThrow(NotFoundError);
  });

  it(
    'should orchestrating the get thread detail action correctly',
    async () => {
      // Arrange
      const threadPayload = {
        id: 'thread-123',
        username: 'dicoding',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-01-01 00:00:00',
      };
      const commentsPayload = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-01-01 00:00:00',
          content: 'Comment content 1',
          is_delete: false,
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2023-01-01 00:00:11',
          content: 'Comment content 2',
          is_delete: true,
        },
      ];
      const repliesPayload1 = [
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2023-01-01 00:00:00',
          content: 'Reply content 1',
          is_delete: true,
        },
      ];
      const repliesPayload2 = [
        {
          id: 'reply-456',
          username: 'dicoding',
          date: '2023-01-01 00:00:11',
          content: 'Reply content 2',
          is_delete: false,
        },
      ];

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.getThreadById = jest.fn(
        () => Promise.resolve(threadPayload)
      );
      mockCommentRepository.getCommentsByThreadId = jest.fn(
        () => Promise.resolve(commentsPayload)
      );
      mockReplyRepository.getRepliesByParentId = jest.fn((commentId) => {
        if (commentId === 'comment-123') {
          return repliesPayload1;
        } else if (commentId === 'comment-456') {
          return repliesPayload2;
        }
        return [];
      });

      /** creating use case instance */
      const getThreadWithCommentsAndRepliesUseCase =
        new GetThreadWithCommentsAndRepliesUseCase({
          threadRepository: mockThreadRepository,
          commentRepository: mockCommentRepository,
          replyRepository: mockReplyRepository,
        });

      // Action
      const threadWithComments = await getThreadWithCommentsAndRepliesUseCase
        .execute('thread-123');

      // Assert
      expect(threadWithComments).toMatchObject({
        id: 'thread-123',
        username: 'dicoding',
        title: 'Thread Title',
        body: 'Thread Body',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            content: 'Comment content 1',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                content: '**balasan telah dihapus**',
              },
            ],
          },
          {
            id: 'comment-456',
            username: 'dicoding',
            content: '**komentar telah dihapus**',
            replies: [
              {
                id: 'reply-456',
                username: 'dicoding',
                content: 'Reply content 2',
              },
            ],
          }
        ],
      });
      expect(mockThreadRepository.getThreadById)
        .toHaveBeenCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId)
        .toHaveBeenCalledWith('thread-123');
      expect(mockReplyRepository.getRepliesByParentId)
        .toHaveBeenCalledWith('comment-123');
      expect(mockReplyRepository.getRepliesByParentId)
        .toHaveBeenCalledWith('comment-456');
    }
  );
});
