const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should throw NotFoundError when reply not exist', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyReplyAvailability = jest.fn(
      () => Promise.resolve(false)
    );

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', 'reply-123'
    )).rejects
      .toThrowError(NotFoundError);
  });

  it(
    'should throw AuthorizationError when user is not reply owner',
    async () => {
      // Arrange
      const mockReplyRepository = new ReplyRepository();
      mockReplyRepository.verifyReplyAvailability = jest.fn(
        () => Promise.resolve(true)
      );
      mockReplyRepository.verifyReplyOwner = jest.fn(
        () => Promise.resolve(false)
      );

      const deleteReplyUseCase = new DeleteReplyUseCase({
        replyRepository: mockReplyRepository,
      });
  
      // Action & Assert
      await expect(deleteReplyUseCase.execute(
        'user-123', 'thread-123', 'comment-123', 'reply-123'
      )).rejects
        .toThrowError(AuthorizationError);
    }
  );
  
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyReplyAvailability = jest.fn(
      () => Promise.resolve(true)
    );
    mockReplyRepository.verifyReplyOwner = jest.fn(
      () => Promise.resolve(true)
    );
    mockReplyRepository.deleteReplyById = jest.fn(
      () => Promise.resolve()
    );
    
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', 'reply-123'
    );

    // Assert
    expect(mockReplyRepository.verifyReplyAvailability)
      .toHaveBeenCalledWith('reply-123');
    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith('user-123', 'reply-123');
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(
        'thread-123', 'comment-123', 'reply-123'
      );
  });
});
