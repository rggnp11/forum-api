const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddReply = require('../../../../Domains/replies/entities/AddReply');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(
      AddReplyUseCase.name
    );
    const { threadId, commentId } = request.params;
    const { userId } = request.auth.credentials;

    const addReply = new AddReply(request.payload);
    const addedReply = await addReplyUseCase.execute(
      userId, threadId, commentId, request.payload
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const { threadId, commentId, replyId } = request.params;
    const { userId } = request.auth.credentials;
    
    await deleteReplyUseCase.execute(userId, threadId, commentId, replyId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
