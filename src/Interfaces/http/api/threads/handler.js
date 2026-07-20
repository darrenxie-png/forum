const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const { id: owner } = req.auth.credentials;
      const useCase = new AddThreadUseCase({ threadRepository: this._threadRepository });
      const addedThread = await useCase.execute({ ...req.body, owner });
      return res.status(201).json({ status: 'success', data: { addedThread } });
    } catch (error) {
      return next(error);
    }
  }

  async getThreadByIdHandler(req, res, next) {
    try {
      const { threadId } = req.params;
      const useCase = new GetThreadDetailUseCase({
        threadRepository: this._threadRepository,
        commentRepository: this._commentRepository,
        replyRepository: this._replyRepository,
        likeRepository: this._likeRepository,
      });
      const thread = await useCase.execute(threadId);
      return res.status(200).json({ status: 'success', data: { thread } });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ThreadsHandler;
