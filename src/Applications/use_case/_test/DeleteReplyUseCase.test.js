const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should throw AuthorizationError when user is not owner', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockReplyRepository = {
      verifyReplyExists: jest.fn().mockResolvedValue(undefined),
      verifyReplyOwner: jest.fn().mockRejectedValue(new AuthorizationError('Anda tidak berhak')),
      deleteReply: jest.fn(),
    };
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await expect(useCase.execute({ threadId: 't-1', commentId: 'c-1', replyId: 'r-1', owner: 'other' })).rejects.toThrow(AuthorizationError);
  });

  it('should orchestrate DeleteReply correctly', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockReplyRepository = {
      verifyReplyExists: jest.fn().mockResolvedValue(undefined),
      verifyReplyOwner: jest.fn().mockResolvedValue(undefined),
      deleteReply: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await useCase.execute({ threadId: 't-1', commentId: 'c-1', replyId: 'r-1', owner: 'user-1' });
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('r-1');
  });
});
