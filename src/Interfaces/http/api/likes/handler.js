const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class LikesHandler {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const { id: userId } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const useCase = new ToggleLikeCommentUseCase({
        likeRepository: this._likeRepository,
        commentRepository: this._commentRepository,
        threadRepository: this._threadRepository,
      });
      await useCase.execute({ threadId, commentId, userId });
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = LikesHandler;
