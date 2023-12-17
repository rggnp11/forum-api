const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {}

  async addLike(userId, commentId) {}
  
  async verifyLikeAvailability(userId, commentId) {}

  async deleteLike(userId, commentId) {}
  
  async getLikeCountByCommentId(commentId) {}
}

module.exports = LikeRepositoryPostgres;
