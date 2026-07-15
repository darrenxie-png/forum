const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('UserRepositoryPostgres', () => {
  const mockIdGenerator = () => '123';

  describe('verifyAvailableUsername', () => {
    it('should throw InvariantError when username already taken', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyAvailableUsername('existinguser')).rejects.toThrow(InvariantError);
    });

    it('should not throw when username available', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.verifyAvailableUsername('newuser')).resolves.not.toThrow();
    });
  });

  describe('addUser', () => {
    it('should persist user and return registered user', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 'user-123', username: 'darren', fullname: 'Darren Dev' }],
        }),
      };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.addUser({ username: 'darren', password: 'hashed', fullname: 'Darren Dev' });
      expect(result.id).toBe('user-123');
      expect(result.username).toBe('darren');
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.getPasswordByUsername('unknown')).rejects.toThrow(InvariantError);
    });

    it('should return password when user found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ password: 'hashed_password' }] }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getPasswordByUsername('darren');
      expect(result).toBe('hashed_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw NotFoundError when user not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      await expect(repo.getIdByUsername('unknown')).rejects.toThrow(NotFoundError);
    });

    it('should return id when user found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ id: 'user-123' }] }) };
      const repo = new UserRepositoryPostgres(mockPool, mockIdGenerator);
      const result = await repo.getIdByUsername('darren');
      expect(result).toBe('user-123');
    });
  });
});
