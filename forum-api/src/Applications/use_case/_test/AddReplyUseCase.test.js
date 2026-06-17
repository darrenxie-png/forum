const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate AddReply correctly', async () => {
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockReplyRepository = {
      addReply: jest.fn().mockResolvedValue({ id: 'reply-1', content: 'A reply', owner: 'user-1' }),
    };

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const result = await useCase.execute({ content: 'A reply', commentId: 'c-1', threadId: 't-1', owner: 'user-1' });

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('t-1');
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith('c-1');
    expect(result.id).toBe('reply-1');
  });
});
