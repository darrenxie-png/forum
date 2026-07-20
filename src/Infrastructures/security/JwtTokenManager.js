const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager {
  constructor(jwt) {
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const payload = this._jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const payload = this._jwt.decode(token);
    return payload;
  }
}

module.exports = JwtTokenManager;
