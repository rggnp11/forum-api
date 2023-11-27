const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(
      'user-123', 'thread-123', 'comment-123'
    );

    // Assert
    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith('user-123', 'thread-123', 'comment-123');
  });
});
