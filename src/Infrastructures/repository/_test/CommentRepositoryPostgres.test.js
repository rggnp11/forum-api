const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
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

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persis addComment and return comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({ content: 'Comment content' });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(
        'user-123', 'thread-123', addComment
      );

      // Assert
      const comments = await CommentsTableTestHelper.getCommentsByThreadId(
        'thread-123'
      );
      expect(comments).toHaveLength(1);
    });

    it('should return addedComment correctly', async () => {
      // Arrange
      const addComment = new AddComment({ content: 'Comment content' });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        'user-123', 'thread-123', addComment
      );

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Comment content',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should mark comment as deleted', async () => {
      // Arrange
      const addComment = new AddComment({ content: 'Comment content' });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(
        'user-123', 'thread-123', addComment
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById(
        'user-123', 'thread-123', addedComment.id
      )

      // Assert
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return correct comments', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        parentId: null,
        content: 'Comment content 123',
        created: '2023-01-01 00:00:00',
        isDelete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-123',
        threadId: 'thread-123',
        parentId: null,
        content: 'Comment content 456',
        created: '2023-01-01 00:00:11',
        isDelete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      // Assert
      expect(comments).toMatchObject([
        {
          id: 'comment-123',
          username: 'dicoding',
          content: 'Comment content 123'
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          content: 'Comment content 456'
        }
      ]);
    });
  });
});