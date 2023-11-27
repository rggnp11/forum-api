const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it(
    'should throw error when payload not meet data type specification',
    () => {
      // Arrange
      const payload = {
        content: 123,
      };

      // Action & Assert
      expect(() => new AddReply(payload)).toThrowError(
        'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  );

  it('should create AddReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'Comment content',
    };

    // Action
    const addComment = new AddReply(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddReply);
    expect(addComment.content).toEqual(payload.content);
  });
});
