const createServer = require('../../../../../Infrastructures/http/createServer');

describe('Authentications API', () => {
  const mockUserRepository = {
    verifyAvailableUsername: jest.fn(),
    addUser: jest.fn(),
    getPasswordByUsername: jest.fn(),
    getIdByUsername: jest.fn(),
  };
  const mockAuthenticationRepository = {
    addToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    deleteToken: jest.fn(),
  };
  const mockAuthenticationTokenManager = {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    decodePayload: jest.fn(),
  };
  const mockPasswordHash = {
    hash: jest.fn(),
    comparePassword: jest.fn(),
  };

  const makeServer = () =>
    createServer({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
      likeRepository: {},
    });

  beforeEach(() => jest.clearAllMocks());

  describe('POST /authentications', () => {
    it('should return 201 with tokens', async () => {
      mockUserRepository.getPasswordByUsername.mockResolvedValue('hashed_password');
      mockPasswordHash.comparePassword.mockResolvedValue(undefined);
      mockUserRepository.getIdByUsername.mockResolvedValue('user-123');
      mockAuthenticationTokenManager.createAccessToken.mockResolvedValue('access_token');
      mockAuthenticationTokenManager.createRefreshToken.mockResolvedValue('refresh_token');
      mockAuthenticationRepository.addToken.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'darren', password: 'secret' },
      });

      expect(response.statusCode).toBe(201);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.accessToken).toBe('access_token');
      expect(payload.data.refreshToken).toBe('refresh_token');
    });
  });

  describe('PUT /authentications', () => {
    it('should return 200 with new access token', async () => {
      mockAuthenticationRepository.verifyRefreshToken.mockResolvedValue(undefined);
      mockAuthenticationTokenManager.verifyRefreshToken.mockResolvedValue({ username: 'darren', id: 'user-123' });
      mockAuthenticationTokenManager.createAccessToken.mockResolvedValue('new_access_token');

      const server = await makeServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: 'valid_refresh_token' },
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.data.accessToken).toBe('new_access_token');
    });
  });

  describe('DELETE /authentications', () => {
    it('should return 200 on logout', async () => {
      mockAuthenticationRepository.verifyRefreshToken.mockResolvedValue(undefined);
      mockAuthenticationRepository.deleteToken.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: 'valid_refresh_token' },
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
    });
  });
});
