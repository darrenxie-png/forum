const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteCommentUseCase', () => {
  it('should throw error when thread does not exist', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockRejectedValue(new Error('Thread tidak ditemukan')) };
    const mockCommentRepository = { verifyCommentExists: jest.fn(), verifyCommentOwner: jest.fn(), deleteComment: jest.fn() };

    const useCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    await expect(useCase.execute({ threadId: 'thread-x', commentId: 'c-1', owner: 'u-1' })).rejects.toThrow();
  });

  it('should throw AuthorizationError when user is not owner', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(undefined),
      verifyCommentOwner: jest.fn().mockRejectedValue(new AuthorizationError('Anda tidak berhak')),
      deleteComment: jest.fn(),
    };

    const useCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    await expect(useCase.execute({ threadId: 'thread-1', commentId: 'c-1', owner: 'other-user' })).rejects.toThrow(AuthorizationError);
  });

  it('should orchestrate DeleteComment correctly', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(undefined),
      verifyCommentOwner: jest.fn().mockResolvedValue(undefined),
      deleteComment: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    await useCase.execute({ threadId: 'thread-1', commentId: 'c-1', owner: 'user-1' });

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith('c-1');
  });
});
