const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  const mockIdGenerator = () => 'abc123';

  describe('likeComment', () => {
    it('should persist like correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new LikeRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.likeComment('comment-1', 'user-1')).resolves.not.toThrow();
    });
  });
  describe('unlikeComment', () => {
    it('should remove like correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new LikeRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.unlikeComment('comment-1', 'user-1')).resolves.not.toThrow();
    });
  });
  describe('isCommentLiked', () => {
    it('should return true when comment is liked', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new LikeRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.isCommentLiked('comment-1', 'user-1');
      expect(result).toBe(true);
    });
    it('should return false when comment is not liked', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new LikeRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.isCommentLiked('comment-1', 'user-1');
      expect(result).toBe(false);
    });
  });
  describe('getLikeCountByCommentId', () => {
    it('should return like count correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rows: [{ count: '5' }] }) };
      const repo = new LikeRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getLikeCountByCommentId('comment-1');
      expect(result).toBe(5);
    });
  });
});
