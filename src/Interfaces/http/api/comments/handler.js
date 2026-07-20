const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const { id: owner } = req.auth.credentials;
      const { threadId } = req.params;
      const useCase = new AddCommentUseCase({
        commentRepository: this._commentRepository,
        threadRepository: this._threadRepository,
      });
      const addedComment = await useCase.execute({ ...req.body, threadId, owner });
      return res.status(201).json({ status: 'success', data: { addedComment } });
    } catch (error) {
      return next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const useCase = new DeleteCommentUseCase({
        commentRepository: this._commentRepository,
        threadRepository: this._threadRepository,
      });
      await useCase.execute({ threadId, commentId, owner });
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CommentsHandler;
