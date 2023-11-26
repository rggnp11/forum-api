const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddComment = require('../../../../Domains/comments/entities/AddComment');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { threadId } = request.params;
    const { userId } = request.auth.credentials;

    const addComment = new AddComment(request.payload);
    const addedComment = await addCommentUseCase.execute(
      userId, threadId, request.payload
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { threadId, commentId } = request.params;
    const { userId } = request.auth.credentials;
    
    await deleteCommentUseCase.execute(userId, threadId, commentId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;