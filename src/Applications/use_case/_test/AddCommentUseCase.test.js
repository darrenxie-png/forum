const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when thread does not exist', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockRejectedValue(new Error('Thread tidak ditemukan')) };
    const mockCommentRepository = { addComment: jest.fn() };

    const useCase = new AddCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    await expect(useCase.execute({ content: 'Test', threadId: 'thread-x', owner: 'user-1' })).rejects.toThrow('Thread tidak ditemukan');
  });

  it('should orchestrate AddComment correctly', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = {
      addComment: jest.fn().mockResolvedValue({ id: 'comment-1', content: 'Test', owner: 'user-1' }),
    };

    const useCase = new AddCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    const result = await useCase.execute({ content: 'Test', threadId: 'thread-1', owner: 'user-1' });

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('comment-1');
  });
});
