const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('AddReplyUseCase', () => {
  it('should throw NotFoundError when thread not exist', async() => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(
      () => Promise.resolve(false)
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: new CommentRepository(),
      replyRepository: new ReplyRepository(),
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', useCasePayload
    )).rejects
      .toThrowError(NotFoundError);
  });

  it('should throw NotFoundError when comment not exist', async() => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockCommentRepository.verifyCommentAvailability = jest.fn(
      () => Promise.resolve(false)
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: new ReplyRepository(),
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', useCasePayload
    )).rejects
      .toThrowError(NotFoundError);
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Reply content',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockCommentRepository.verifyCommentAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockReplyRepository.addReply = jest.fn(
      () => Promise.resolve(mockAddedReply)
    );
    
    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    
    // Action
    const addedReply = await addReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', useCasePayload
    );

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      'user-123',
      'thread-123',
      'comment-123',
      new AddReply({
        content: useCasePayload.content,
      }),
    );
  });
});