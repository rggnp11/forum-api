const ToggleLikeUseCase = require('../../../../Applications/use_case/ToggleLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const toggleLikeUseCase = this._container.getInstance(
      ToggleLikeUseCase.name
    );
    const { threadId, commentId } = request.params;
    const { userId } = request.auth.credentials;

    await toggleLikeUseCase.execute(userId, threadId, commentId);

    const response = h.response({ status: 'success' });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
