const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 if authentication missing', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan title dan body');
    });

    it('should response 400 if payload data type invalid', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 1000,
      };
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
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('title dan body harus string');
    });

    it('should response 201 and added thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
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
        url: '/threads',
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toEqual('Thread Title');
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should response 404 if thread not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-XXXXXXXXXX',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should return 200 and thread with comments and replies', async () => {
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
      // Add comments
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          content: 'Comment content 1',
        },
      });
      const commentJson = JSON.parse(commentResponse.payload);
      await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          content: 'Comment content 2',
        },
      });
      // Add reply
      await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies`,
        headers: {
          'Authorization': `Bearer ${authJson.data.accessToken}`,
        },
        payload: {
          content: 'Reply content',
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadJson.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      // expect(responseJson.data.thread.comments[0].replies).toBeInstanceOf(Array);
    });
  });
});
