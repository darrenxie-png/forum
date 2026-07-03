const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const useCase = new AddCommentUseCase({
      commentRepository: this._commentRepository,
      threadRepository: this._threadRepository,
    });
    const addedComment = await useCase.execute({ ...request.payload, threadId, owner });
    return h.response({ status: 'success', data: { addedComment } }).code(201);
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const useCase = new DeleteCommentUseCase({
      commentRepository: this._commentRepository,
      threadRepository: this._threadRepository,
    });
    await useCase.execute({ threadId, commentId, owner });
    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = CommentsHandler;
