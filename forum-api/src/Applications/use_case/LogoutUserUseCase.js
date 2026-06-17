class LogoutUserUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }
}

module.exports = LogoutUserUseCase;
