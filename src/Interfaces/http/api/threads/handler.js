const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const GetThreadWithCommentsAndRepliesUseCase = require('../../../../Applications/use_case/GetThreadWithCommentsAndRepliesUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(
      AddThreadUseCase.name
    );
    const { userId } = request.auth.credentials;

    const addThread = new AddThread(request.payload);
    const addedThread = await addThreadUseCase.execute(
      userId, request.payload
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const getThreadWithCommentsAndRepliesUseCase = this._container.getInstance(
      GetThreadWithCommentsAndRepliesUseCase.name
    );
    const { threadId } = request.params;

    const threadWithComments = await getThreadWithCommentsAndRepliesUseCase
      .execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: threadWithComments,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
