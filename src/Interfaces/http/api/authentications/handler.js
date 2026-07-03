const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');

class AuthenticationsHandler {
  constructor({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const useCase = new LoginUserUseCase({
      userRepository: this._userRepository,
      authenticationRepository: this._authenticationRepository,
      authenticationTokenManager: this._authenticationTokenManager,
      passwordHash: this._passwordHash,
    });
    const { accessToken, refreshToken } = await useCase.execute(request.payload);
    return h.response({ status: 'success', data: { accessToken, refreshToken } }).code(201);
  }

  async putAuthenticationHandler(request, h) {
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: this._authenticationRepository,
      authenticationTokenManager: this._authenticationTokenManager,
    });
    const accessToken = await useCase.execute(request.payload);
    return h.response({ status: 'success', data: { accessToken } }).code(200);
  }

  async deleteAuthenticationHandler(request, h) {
    const useCase = new LogoutUserUseCase({
      authenticationRepository: this._authenticationRepository,
    });
    await useCase.execute(request.payload);
    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = AuthenticationsHandler;
