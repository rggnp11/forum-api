const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 if authentication missing', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 if payload data missing', async () => {
      // Arrange
      const requestPayload = {};
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
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 if payload data type invalid', async () => {
      // Arrange
      const requestPayload = { content: 123 };
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
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });

    it('should response 404 if thread not exist', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-XXXXXXXXXX/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada atau tidak valid');
    });

    it('should response 201 and added thread', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual('Comment content');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 if authentication missing', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when the comment not exist', async () => {
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
        method: 'DELETE',
        url: `/threads/thread-XXXXXXXXXX/comments/comment-XXXXXXXXXX`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });

    it('should response 403 when deleted not by owner', async() => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        },
      });
      // Authenticate
      const authDicodingResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authDicodingJson = JSON.parse(authDicodingResponse.payload);
      const authJohnDoeResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authJohnDoeJson = JSON.parse(authJohnDoeResponse.payload);
      // Add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authDicodingJson.data.accessToken}`,
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
          'Authorization': `Bearer ${authDicodingJson.data.accessToken}`,
        },
        payload: { content: 'Comment content' },
      });
      const commentJson = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}`,
        headers: {
          'Authorization': `Bearer ${authJohnDoeJson.data.accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    it('should response 200', async() => {
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
      // Add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: { content: 'Comment content' },
      });
      const commentJson = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
    });
  });
});
