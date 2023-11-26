const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const GetThreadWithCommentsUseCase = require('../../../../Applications/use_case/GetThreadWithCommentsUseCase');

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
    const getThreadWithCommentsUseCase = this._container.getInstance(
      GetThreadWithCommentsUseCase.name
    );
    const { threadId } = request.params;

    const threadWithComments = await getThreadWithCommentsUseCase.execute(
      threadId
    );

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
