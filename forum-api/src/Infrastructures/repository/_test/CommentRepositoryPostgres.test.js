const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const mockIdGenerator = () => 'abc123';

  describe('addComment', () => {
    it('should persist comment and return correctly', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 'comment-abc123', content: 'A comment', owner: 'user-1' }],
        }),
      };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.addComment({ content: 'A comment', threadId: 'thread-1', owner: 'user-1' });
      expect(result.id).toBe('comment-abc123');
      expect(result.content).toBe('A comment');
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.deleteComment('comment-1')).resolves.not.toThrow();
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return all comments by thread id', async () => {
      const mockComments = [
        { id: 'comment-1', username: 'user1', date: '2024-01-01', content: 'Comment', is_deleted: false },
      ];
      const mockPool = { query: jest.fn().mockResolvedValue({ rows: mockComments }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getCommentsByThreadId('thread-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('comment-1');
    });
  });

  describe('verifyCommentExists', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyCommentExists('comment-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should not throw when comment exists', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyCommentExists('comment-1')).resolves.not.toThrow();
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyCommentOwner('comment-xxx', 'user-1')).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when user is not owner', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-2' }] }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyCommentOwner('comment-1', 'user-1')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw when user is owner', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-1' }] }) };
      const repo = new CommentRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyCommentOwner('comment-1', 'user-1')).resolves.not.toThrow();
    });
  });
});
