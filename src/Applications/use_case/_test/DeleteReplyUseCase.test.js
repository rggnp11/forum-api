const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(
      'user-123', 'thread-123', 'comment-123', 'reply-123'
    );

    // Assert
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(
        'user-123', 'thread-123', 'comment-123', 'reply-123'
      );
  });
});
