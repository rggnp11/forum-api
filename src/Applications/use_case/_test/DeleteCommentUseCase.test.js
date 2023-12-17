const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteCommentUseCase', () => {
  it('should throw NotFoundError when comment not exist', async() => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentAvailability = jest.fn(
      () => Promise.resolve(false)
    );
      
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(
      'user-123', 'thread-123', 'comment-123')
    ).rejects
      .toThrowError(NotFoundError);
  });

  it(
    'should throw AuthorizationError when user is not comment owner',
    async() => {
      // Arrange
      const mockCommentRepository = new CommentRepository();
      mockCommentRepository.verifyCommentAvailability = jest.fn(
        () => Promise.resolve(true)
      );
      mockCommentRepository.verifyCommentOwner = jest.fn(
        () => Promise.resolve(false)
      );
        
      const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: mockCommentRepository,
      });

      // Action & Assert
      await expect(deleteCommentUseCase.execute(
        'user-123', 'thread-123', 'comment-123')
      ).rejects
        .toThrowError(AuthorizationError);
    }
  );

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockCommentRepository.verifyCommentOwner = jest.fn(
      () => Promise.resolve(true)
    );
    mockCommentRepository.deleteCommentById = jest.fn(
      () => Promise.resolve()
    );
    
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(
      'user-123', 'thread-123', 'comment-123'
    );

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith('user-123', 'comment-123');
    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith('thread-123', 'comment-123');
  });
});
