class ToggleLikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const isLiked = await this._likeRepository.isCommentLiked(commentId, userId);
    if (isLiked) {
      await this._likeRepository.unlikeComment(commentId, userId);
    } else {
      await this._likeRepository.likeComment(commentId, userId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
