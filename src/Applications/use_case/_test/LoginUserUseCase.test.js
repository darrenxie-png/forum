const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrate LoginUser correctly', async () => {
    const mockUserRepository = {
      getPasswordByUsername: jest.fn().mockResolvedValue('hashed_password'),
      getIdByUsername: jest.fn().mockResolvedValue('user-1'),
    };
    const mockAuthenticationRepository = { addToken: jest.fn().mockResolvedValue(undefined) };
    const mockAuthenticationTokenManager = {
      createAccessToken: jest.fn().mockResolvedValue('access_token'),
      createRefreshToken: jest.fn().mockResolvedValue('refresh_token'),
    };
    const mockPasswordHash = { comparePassword: jest.fn().mockResolvedValue(undefined) };
    const useCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });
    const result = await useCase.execute({ username: 'darren', password: 'secret' });
    expect(result.accessToken).toBe('access_token');
    expect(result.refreshToken).toBe('refresh_token');
  });
});
