const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadWithCommentsUseCase = require('../GetThreadWithCommentsUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadPayload = {
      id: 'thread-123',
      username: 'dicoding',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '1970-01-01 00:00:00',
    };
    const commentsPayload = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '1970-01-01 00:00:00',
        content: 'Comment content 1',
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '1970-01-01 00:00:11',
        content: 'Comment content 2',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(threadPayload));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentsPayload));
    
    /** creating use case instance */
    const getThreadWithCommentsUseCase = new GetThreadWithCommentsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadWithComments = await getThreadWithCommentsUseCase.execute(
      'thread-123'
    );

    // Assert
    expect(threadWithComments).toStrictEqual({
      id: 'thread-123',
      username: 'dicoding',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '1970-01-01 00:00:00',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '1970-01-01 00:00:00',
          content: 'Comment content 1',
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '1970-01-01 00:00:11',
          content: 'Comment content 2',
        }
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123'
    );
  });
});
