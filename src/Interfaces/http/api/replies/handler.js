const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const useCase = new AddReplyUseCase({
        replyRepository: this._replyRepository,
        commentRepository: this._commentRepository,
        threadRepository: this._threadRepository,
      });
      const addedReply = await useCase.execute({ ...req.body, commentId, threadId, owner });
      return res.status(201).json({ status: 'success', data: { addedReply } });
    } catch (error) {
      return next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId, replyId } = req.params;
      const useCase = new DeleteReplyUseCase({
        replyRepository: this._replyRepository,
        commentRepository: this._commentRepository,
        threadRepository: this._threadRepository,
      });
      await useCase.execute({ threadId, commentId, replyId, owner });
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = RepliesHandler;
