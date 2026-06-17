class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.verifyRefreshToken(refreshToken);
    const { username, id } = await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    const accessToken = await this._authenticationTokenManager.createAccessToken({ username, id });
    return accessToken;
  }
}

module.exports = RefreshAuthenticationUseCase;
