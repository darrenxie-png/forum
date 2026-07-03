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

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const useCase = new AddThreadUseCase({ threadRepository: this._threadRepository });
    const addedThread = await useCase.execute({ ...request.payload, owner });
    return h.response({ status: 'success', data: { addedThread } }).code(201);
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const useCase = new GetThreadDetailUseCase({
      threadRepository: this._threadRepository,
      commentRepository: this._commentRepository,
      replyRepository: this._replyRepository,
      likeRepository: this._likeRepository,
    });
    const thread = await useCase.execute(threadId);
    return h.response({ status: 'success', data: { thread } }).code(200);
  }
}

module.exports = ThreadsHandler;
