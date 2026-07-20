const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw error when refresh token not found', async () => {
    const mockAuthenticationRepository = {
      verifyRefreshToken: jest.fn().mockRejectedValue(new Error('Refresh token tidak ditemukan')),
      deleteToken: jest.fn(),
    };
    const useCase = new LogoutUserUseCase({ authenticationRepository: mockAuthenticationRepository });
    await expect(useCase.execute({ refreshToken: 'invalid_token' })).rejects.toThrow();
  });

  it('should orchestrate LogoutUser correctly', async () => {
    const mockAuthenticationRepository = {
      verifyRefreshToken: jest.fn().mockResolvedValue(undefined),
      deleteToken: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new LogoutUserUseCase({ authenticationRepository: mockAuthenticationRepository });
    await useCase.execute({ refreshToken: 'valid_token' });
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith('valid_token');
  });
});
