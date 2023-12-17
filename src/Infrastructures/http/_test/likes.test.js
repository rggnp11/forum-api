const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 if authentication missing', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not exist', async () => {
      // Arrange
      const server = await createServer(container);
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // Authenticate
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authJson = JSON.parse(authResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-XXXXXXXXXX/comments/comment-XXXXXXXXXX/likes',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'thread tidak ditemukan atau tidak valid'
      );
    });

    it('should response 404 if comment not exist', async () => {
      // Arrange
      const server = await createServer(container);
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // Authenticate
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authJson = JSON.parse(authResponse.payload);
      // Add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });
      const threadJson = JSON.parse(threadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadJson.data.addedThread.id}/comments/comment-XXXXXXXXXX/likes`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'komentar tidak ditemukan atau tidak valid'
      );
    });

    it('should response 200', async () => {
      // Arrange
      const requestPayload = { content: 'Comment content' };
      const server = await createServer(container);
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // Authenticate
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authJson = JSON.parse(authResponse.payload);
      // Add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });
      const threadJson = JSON.parse(threadResponse.payload);
      // Add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          content: 'Comment content',
        },
      });
      const commentJson = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/likes`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
