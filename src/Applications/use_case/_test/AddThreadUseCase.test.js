const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const mockThread = new Thread({
      id: 'thread-123',
      owner: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      created: '2023-11-24T22:29:00',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    
    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    
    // Action
    const thread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(new Thread({
      id: 'thread-123',
      owner: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      created: '2023-11-24T22:29:00',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});