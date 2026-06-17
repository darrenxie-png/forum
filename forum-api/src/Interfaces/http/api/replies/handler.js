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

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const useCase = new AddReplyUseCase({
      replyRepository: this._replyRepository,
      commentRepository: this._commentRepository,
      threadRepository: this._threadRepository,
    });
    const addedReply = await useCase.execute({ ...request.payload, commentId, threadId, owner });
    return h.response({ status: 'success', data: { addedReply } }).code(201);
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const useCase = new DeleteReplyUseCase({
      replyRepository: this._replyRepository,
      commentRepository: this._commentRepository,
      threadRepository: this._threadRepository,
    });
    await useCase.execute({ threadId, commentId, replyId, owner });
    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = RepliesHandler;
