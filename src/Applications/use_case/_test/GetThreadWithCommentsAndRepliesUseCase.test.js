const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadWithCommentsAndRepliesUseCase = require('../GetThreadWithCommentsAndRepliesUseCase');

describe('GetThreadDetailUseCase', () => {
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
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2023-01-01 00:00:11',
          content: 'Comment content 2',
        },
      ];
      const repliesPayload = [
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2023-01-01 00:00:00',
          content: 'Reply content',
        },
      ];

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(threadPayload));
      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(commentsPayload));
      mockReplyRepository.getRepliesByParentId = jest.fn()
        .mockImplementation(() => Promise.resolve(repliesPayload));
      
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
                content: 'Reply content',
              },
            ],
          },
          {
            id: 'comment-456',
            username: 'dicoding',
            content: 'Comment content 2',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                content: 'Reply content',
              },
            ],
          }
        ],
      });
      expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
        'thread-123'
      );
    }
  );
});
