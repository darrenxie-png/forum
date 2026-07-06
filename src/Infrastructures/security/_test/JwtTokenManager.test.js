const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  beforeEach(() => {
    process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes';
    process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_purposes';
  });

  it('should use default Jwt when no argument provided', () => {
  process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes_min32';
  const jwtTokenManager = new JwtTokenManager();
  expect(jwtTokenManager).toBeDefined();
});

  it('should create access token correctly', async () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const accessToken = await jwtTokenManager.createAccessToken({ username: 'darren', id: 'user-1' });
    expect(typeof accessToken).toBe('string');
  });

  it('should create refresh token correctly', async () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'darren', id: 'user-1' });
    expect(typeof refreshToken).toBe('string');
  });

  it('should verify refresh token correctly and return payload', async () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'darren', id: 'user-1' });
    const payload = await jwtTokenManager.verifyRefreshToken(refreshToken);
    expect(payload.username).toBe('darren');
    expect(payload.id).toBe('user-1');
  });

  it('should throw InvariantError when verify invalid refresh token', async () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    await expect(jwtTokenManager.verifyRefreshToken('invalid_token')).rejects.toThrow(InvariantError);
  });

  it('should decode payload correctly', async () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const accessToken = await jwtTokenManager.createAccessToken({ username: 'darren', id: 'user-1' });
    const payload = await jwtTokenManager.decodePayload(accessToken);
    expect(payload.id).toBe('user-1');
  });
});
