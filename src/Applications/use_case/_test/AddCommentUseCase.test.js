const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should throw NotFoundError when thread not exist', async() => {
    // Arrange
    const useCasePayload = {
      content: 'Comment content',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: new CommentRepository(),
    });

    // Action and Assert
    expect(addCommentUseCase.execute(
      'user-123', 'thread-123', useCasePayload
    )).rejects
      .toThrowError(NotFoundError);
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Comment content',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    
    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    
    // Action
    const addedComment = await addCommentUseCase.execute(
      'user-123', 'thread-123', useCasePayload
    );

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      'thread-123'
    );
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      'user-123',
      'thread-123',
      new AddComment({
        content: useCasePayload.content,
      }),
    );
  });
});