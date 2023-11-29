const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist addThread and return thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool, fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        'user-123', addThread
      );

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Thread Title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should return false when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadExists = await threadRepositoryPostgres.verifyThreadAvailability(
        'thread-123'
      );

      // Assert
      expect(threadExists).toEqual(false);
    });

    it('should return true when thread exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Thread Title',
        body: 'Thread Body',
        created: '2023-01-01 00:00:00',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadExists = await threadRepositoryPostgres.verifyThreadAvailability(
        'thread-123'
      );

      // Assert
      expect(threadExists).toEqual(true);
    });
  });

  describe('getThreadById function', () => {
    it('should return correct thread when thread exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Thread Title',
        body: 'Thread Body',
        created: '2023-01-01 00:00:00',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(
        'thread-123'
      );

      // Assert
      expect(thread).toMatchObject({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        username: 'dicoding',
      });
    });
  });
});
