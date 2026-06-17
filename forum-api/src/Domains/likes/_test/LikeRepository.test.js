const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract method', async () => {
    const repo = new LikeRepository();
    await expect(repo.likeComment('', '')).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.unlikeComment('', '')).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.isCommentLiked('', '')).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.getLikeCountByCommentId('')).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
