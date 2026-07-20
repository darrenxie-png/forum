const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  const mockIdGenerator = () => 'abc123';

  describe('addThread', () => {
    it('should persist thread and return correctly', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: 'thread-abc123', title: 'Test Thread', owner: 'user-1' }] }),
      };
      const repo = new ThreadRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.addThread({ title: 'Test Thread', body: 'Body', owner: 'user-1' });
      expect(result.id).toBe('thread-abc123');
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }) };
      const repo = new ThreadRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.getThreadById('thread-xxx')).rejects.toThrow(NotFoundError);
    });
    it('should return thread when found', async () => {
      const mockThread = { id: 'thread-1', title: 'Test', body: 'Body', date: '2024-01-01', username: 'darren' };
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [mockThread] }) };
      const repo = new ThreadRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getThreadById('thread-1');
      expect(result.id).toBe('thread-1');
    });
  });

  describe('verifyThreadExists', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new ThreadRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyThreadExists('thread-xxx')).rejects.toThrow(NotFoundError);
    });
    it('should not throw when thread exists', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new ThreadRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyThreadExists('thread-1')).resolves.not.toThrow();
    });
  });
});
