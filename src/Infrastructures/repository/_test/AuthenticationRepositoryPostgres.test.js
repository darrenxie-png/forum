const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthenticationRepositoryPostgres', () => {
  describe('addToken', () => {
    it('should persist token correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new AuthenticationRepositoryPostgres(mockPool);
      await expect(repo.addToken('refresh_token')).resolves.not.toThrow();
    });
  });
  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when token not found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 0 }) };
      const repo = new AuthenticationRepositoryPostgres(mockPool);
      await expect(repo.verifyRefreshToken('invalid_token')).rejects.toThrow(InvariantError);
    });
    it('should not throw when token found', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const repo = new AuthenticationRepositoryPostgres(mockPool);
      await expect(repo.verifyRefreshToken('valid_token')).resolves.not.toThrow();
    });
  });
  describe('deleteToken', () => {
    it('should delete token correctly', async () => {
      const mockPool = { query: jest.fn().mockResolvedValue({}) };
      const repo = new AuthenticationRepositoryPostgres(mockPool);
      await expect(repo.deleteToken('refresh_token')).resolves.not.toThrow();
    });
  });
});
