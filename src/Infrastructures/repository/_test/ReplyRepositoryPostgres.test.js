const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  const mockIdGenerator = () => 'abc123';

  describe('addReply', () => {
    it('should persist reply and return correctly', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 'reply-abc123', content: 'A reply', owner: 'user-1' }],
        }),
      };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.addReply({ content: 'A reply', commentId: 'c-1', threadId: 't-1', owner: 'user-1' });
      expect(result.id).toBe('reply-abc123');
    });
  });

  describe('deleteReply', () => {
    it('should soft delete reply correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.deleteReply('reply-1')).resolves.not.toThrow();
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return all replies by comment id', async () => {
      const mockReplies = [
        { id: 'reply-1', username: 'user1', date: '2024-01-01', content: 'Reply', is_deleted: false },
      ];
      const mockPool = { query: jest.fn().mockResolvedValue({ rows: mockReplies }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getRepliesByCommentId('comment-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('verifyReplyExists', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyReplyExists('reply-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should not throw when reply exists', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyReplyExists('reply-1')).resolves.not.toThrow();
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyReplyOwner('reply-xxx', 'user-1')).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when user is not owner', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-2' }] }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyReplyOwner('reply-1', 'user-1')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw when user is owner', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-1' }] }) };
      const repo = new ReplyRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyReplyOwner('reply-1', 'user-1')).resolves.not.toThrow();
    });
  });
});
