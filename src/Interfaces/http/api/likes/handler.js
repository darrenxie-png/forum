const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class LikesHandler {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const useCase = new ToggleLikeCommentUseCase({
      likeRepository: this._likeRepository,
      commentRepository: this._commentRepository,
      threadRepository: this._threadRepository,
    });
    await useCase.execute({ threadId, commentId, userId });
    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = LikesHandler;
