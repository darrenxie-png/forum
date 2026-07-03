const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };
  const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };

  it('should like comment when not yet liked', async () => {
    const mockLikeRepository = {
      isCommentLiked: jest.fn().mockResolvedValue(false),
      likeComment: jest.fn().mockResolvedValue(undefined),
      unlikeComment: jest.fn(),
    };

    const useCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute({ threadId: 't-1', commentId: 'c-1', userId: 'u-1' });
    expect(mockLikeRepository.likeComment).toHaveBeenCalledWith('c-1', 'u-1');
    expect(mockLikeRepository.unlikeComment).not.toHaveBeenCalled();
  });

  it('should unlike comment when already liked', async () => {
    const mockLikeRepository = {
      isCommentLiked: jest.fn().mockResolvedValue(true),
      likeComment: jest.fn(),
      unlikeComment: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute({ threadId: 't-1', commentId: 'c-1', userId: 'u-1' });
    expect(mockLikeRepository.unlikeComment).toHaveBeenCalledWith('c-1', 'u-1');
    expect(mockLikeRepository.likeComment).not.toHaveBeenCalled();
  });
});
