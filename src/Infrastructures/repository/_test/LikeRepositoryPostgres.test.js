const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
      title: 'Thread Title',
      body: 'Thread Body',
      created: '2023-01-01 00:00:00',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
      parentId: null,
      content: 'Comment content',
      created: '2023-01-01 00:00:00',
      isDelete: false,
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      owner: 'user-123',
      threadId: 'thread-123',
      parentId: null,
      content: 'Comment content',
      created: '2023-01-01 00:00:00',
      isDelete: false,
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it(
      'should persist a like and return persisted like correctly',
      async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, fakeIdGenerator
        );

        // Action
        await likeRepositoryPostgres.addLike('user-123', 'comment-123');

        // Assert
        const likesCount1 = await LikesTableTestHelper.getLikesCountByCommentId(
          'comment-123'
        );
        expect(likesCount1).toEqual(1);
      }
    );
  });

  describe('verifyLikeAvailability function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, fakeIdGenerator
      );
      await LikesTableTestHelper.addLike('like-123', 'user-123', 'comment-123');

      // Action
      const isLikeAvailable = await likeRepositoryPostgres
        .verifyLikeAvailability('user-123', 'comment-123');

      // Assert
      expect(isLikeAvailable).toEqual(true);
    });

    it('should return false if like not exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      const isLikeAvailable = await likeRepositoryPostgres
        .verifyLikeAvailability('user-123', 'comment-123');

      // Assert
      expect(isLikeAvailable).toEqual(false);
    });
  });

  describe('deleteLike function', () => {
    it('should delete a like', async() => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike('like-123', 'user-123', 'comment-123');

      // Action
      const likesCountBeforeDelete = await LikesTableTestHelper
        .getLikesCountByCommentId('comment-123');

      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      const likesCountAfterDelete = await LikesTableTestHelper
        .getLikesCountByCommentId('comment-123');
      
      // Assert
      expect(likesCountBeforeDelete).toEqual(1);
      expect(likesCountAfterDelete).toEqual(0);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const zeroLikeCount = await likeRepositoryPostgres
        .getLikeCountByCommentId('comment-123');

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123'
      });

      const oneLikeCount = await likeRepositoryPostgres
        .getLikeCountByCommentId('comment-123');

      // Assert
      expect(zeroLikeCount).toEqual(0);
      expect(oneLikeCount).toEqual(1);      
    })
  });
});
