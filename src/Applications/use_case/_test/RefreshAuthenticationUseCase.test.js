const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrate RefreshAuthentication correctly', async () => {
    const mockAuthenticationRepository = {
      verifyRefreshToken: jest.fn().mockResolvedValue(undefined),
    };
    const mockAuthenticationTokenManager = {
      verifyRefreshToken: jest.fn().mockResolvedValue({ username: 'darren', id: 'user-1' }),
      createAccessToken: jest.fn().mockResolvedValue('new_access_token'),
    };

    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const result = await useCase.execute({ refreshToken: 'valid_refresh_token' });
    expect(result).toBe('new_access_token');
    expect(mockAuthenticationRepository.verifyRefreshToken).toHaveBeenCalledWith('valid_refresh_token');
  });
});
