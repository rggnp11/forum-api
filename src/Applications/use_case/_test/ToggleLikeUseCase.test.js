const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ToggleLikeUseCase = require('../ToggleLikeUseCase');

describe('ToggleLikeUseCase', () => {
  it('should throw NotFoundError when thread not exist', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(
      () => Promise.resolve(false)
    );

    /** creating use case instance */
    const toggleLikeCuseCase = new ToggleLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: new CommentRepository(),
      likeRepository: new LikeRepository(),
    });

    // Action and Assert
    await expect(toggleLikeCuseCase.execute(
      'user-123', 'thread-123', 'comment-123'
    )).rejects
      .toThrowError(NotFoundError);
  });

  it('should throw NotFoundError when comment not exist', async () => {
    // Arrange
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
    const toggleLikeCuseCase = new ToggleLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: new LikeRepository(),
    });

    // Action and Assert
    await expect(toggleLikeCuseCase.execute(
      'user-123', 'thread-123', 'comment-123'
    )).rejects
      .toThrowError(NotFoundError);
  });

  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockCommentRepository.verifyCommentAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockLikeRepository.verifyLikeAvailability = jest.fn(
      () => Promise.resolve(false)
    );
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCuseCase = new ToggleLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    
    // Action
    await toggleLikeCuseCase.execute('user-123', 'thread-123', 'comment-123');

    // Assert
  });
});
