const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  const mockBcrypt = {
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn(),
  };

  it('should hash password correctly', async () => {
    const bcryptPasswordHash = new BcryptPasswordHash(mockBcrypt);
    const hashed = await bcryptPasswordHash.hash('password');
    expect(hashed).toBe('hashed_password');
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password', 10);
  });

  it('should not throw when comparing correct password', async () => {
    mockBcrypt.compare.mockResolvedValue(true);
    const bcryptPasswordHash = new BcryptPasswordHash(mockBcrypt);
    await expect(bcryptPasswordHash.comparePassword('secret', 'hashed')).resolves.not.toThrow();
  });

  it('should throw AuthenticationError when password does not match', async () => {
    mockBcrypt.compare.mockResolvedValue(false);
    const bcryptPasswordHash = new BcryptPasswordHash(mockBcrypt);
    await expect(bcryptPasswordHash.comparePassword('wrong', 'hashed')).rejects.toThrow(AuthenticationError);
  });
});
