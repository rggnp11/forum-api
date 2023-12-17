const LikeRepository = require('../LikeRepository');

describe ('LikeRepository interface', () => {
  it('should throw error when invoke absrtact behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.addLike('', '')).rejects
      .toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.verifyLikeAvailability('', '')).rejects
      .toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.deleteLike('', '')).rejects
      .toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountByCommentId('')).rejects
      .toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});