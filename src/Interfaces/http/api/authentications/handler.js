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

  async postAuthenticationHandler(req, res, next) {
    try {
      const useCase = new LoginUserUseCase({
        userRepository: this._userRepository,
        authenticationRepository: this._authenticationRepository,
        authenticationTokenManager: this._authenticationTokenManager,
        passwordHash: this._passwordHash,
      });
      const { accessToken, refreshToken } = await useCase.execute(req.body);
      return res.status(201).json({ status: 'success', data: { accessToken, refreshToken } });
    } catch (error) {
      return next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      const useCase = new RefreshAuthenticationUseCase({
        authenticationRepository: this._authenticationRepository,
        authenticationTokenManager: this._authenticationTokenManager,
      });
      const accessToken = await useCase.execute(req.body);
      return res.status(200).json({ status: 'success', data: { accessToken } });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      const useCase = new LogoutUserUseCase({ authenticationRepository: this._authenticationRepository });
      await useCase.execute(req.body);
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthenticationsHandler;
