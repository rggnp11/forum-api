const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
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
  });

  beforeEach(async () => {
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
      parentId: null,
      content: 'Comment content',
      created: '2023-01-01 00:00:00',
      isDelete: false,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist addReply and return reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Assert
      const replies = await CommentsTableTestHelper.getRepliesByParentId(
        'comment-123'
      );
      expect(replies).toHaveLength(1);
    });

    it('should return addedReply correctly', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should return false if reply not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {}
      );

      // Action
      const isReplyAvailable = await replyRepositoryPostgres
        .verifyReplyAvailability('reply-123');
      
      // Assert
      expect(isReplyAvailable).toEqual(false);
    });

    it('should return true if comment exists', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );
      // Add reply
      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Action
      const isReplyAvailable = await replyRepositoryPostgres
        .verifyReplyAvailability(addedReply.id);
      
      // Assert
      expect(isReplyAvailable).toEqual(true);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should return false when user is not reply owner', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );
      // Add reply
      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Action
      const isReplyOwner = await replyRepositoryPostgres
        .verifyReplyOwner('user-456', addedReply.id);
        
      // Assert
      expect(isReplyOwner).toEqual(false);
    });

    it('should return true when user is reply owner', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );
      // Add reply
      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Action
      const isReplyOwner = await replyRepositoryPostgres
        .verifyReplyOwner('user-123', addedReply.id);
        
      // Assert
      expect(isReplyOwner).toEqual(true);
    });
  });

  describe('deleteReplyById function', () => {
    it('should mark reply as deleted', async () => {
      // Arrange
      const addReply = new AddReply({ content: 'Reply content' });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator
      );
      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123', 'thread-123', 'comment-123', addReply
      );

      // Action
      await replyRepositoryPostgres.deleteReplyById(
        'thread-123', 'comment-123', addedReply.id
      )

      // Assert
      const replies = await CommentsTableTestHelper.getRepliesByParentId(
        'comment-123'
      );
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByParentId', () => {
    it('should return correct replies', async () => {
      // Arrange
      await CommentsTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        parentId: 'comment-123',
        content: 'Reply content 123',
        created: '2023-01-01 00:00:00',
        isDelete: false,
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-456',
        owner: 'user-123',
        threadId: 'thread-123',
        parentId: 'comment-123',
        content: 'Reply content 456',
        created: '2023-01-01 00:00:11',
        isDelete: false,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {}
      );

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByParentId(
        'comment-123'
      );

      // Assert
      expect(replies).toMatchObject([
        {
          id: 'reply-123',
          username: 'dicoding',
          content: 'Reply content 123'
        },
        {
          id: 'reply-456',
          username: 'dicoding',
          content: 'Reply content 456'
        }
      ]);
    });
  });
});