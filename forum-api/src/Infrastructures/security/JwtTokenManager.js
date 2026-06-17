const Jwt = require('@hapi/jwt');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class JwtTokenManager {
  constructor(jwt = Jwt.token) {
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
