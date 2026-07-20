const request = require('supertest');
const createServer = require('../../../../../Infrastructures/http/createServer');
const InvariantError = require('../../../../../Commons/exceptions/InvariantError');

describe('Authentications API', () => {
  const makeApp = (userOverrides = {}, authRepoOverrides = {}, tokenManagerOverrides = {}, passwordHashOverrides = {}) => {
    return createServer({
      userRepository: {
        getPasswordByUsername: jest.fn(),
        getIdByUsername: jest.fn(),
        ...userOverrides,
      },
      authenticationRepository: {
        addToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        deleteToken: jest.fn(),
        ...authRepoOverrides,
      },
      authenticationTokenManager: {
        createAccessToken: jest.fn(),
        createRefreshToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        ...tokenManagerOverrides,
      },
      passwordHash: { comparePassword: jest.fn(), ...passwordHashOverrides },
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
      likeRepository: {},
    });
  };

  describe('POST /authentications', () => {
    it('should return 201 with tokens', async () => {
      const app = makeApp(
        { getPasswordByUsername: jest.fn().mockResolvedValue('hashed'), getIdByUsername: jest.fn().mockResolvedValue('user-123') },
        { addToken: jest.fn().mockResolvedValue(undefined) },
        { createAccessToken: jest.fn().mockResolvedValue('access_token'), createRefreshToken: jest.fn().mockResolvedValue('refresh_token') },
        { comparePassword: jest.fn().mockResolvedValue(undefined) }
      );
      const res = await request(app).post('/authentications').send({ username: 'darren', password: 'secret' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.accessToken).toBe('access_token');
    });

    it('should return 400 when postAuthentication throws InvariantError', async () => {
      const app = makeApp({ getPasswordByUsername: jest.fn().mockRejectedValue(new InvariantError('kredensial salah')) });
      const res = await request(app).post('/authentications').send({ username: 'unknown', password: 'wrong' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /authentications', () => {
    it('should return 200 with new access token', async () => {
      const app = makeApp(
        {},
        { verifyRefreshToken: jest.fn().mockResolvedValue(undefined) },
        {
          verifyRefreshToken: jest.fn().mockResolvedValue({ username: 'darren', id: 'user-123' }),
          createAccessToken: jest.fn().mockResolvedValue('new_access_token'),
        }
      );
      const res = await request(app).put('/authentications').send({ refreshToken: 'valid_refresh_token' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBe('new_access_token');
    });

    it('should return 400 when putAuthentication throws InvariantError', async () => {
      const app = makeApp(
        {},
        {},
        { verifyRefreshToken: jest.fn().mockRejectedValue(new InvariantError('refresh token tidak valid')) }
      );
      const res = await request(app).put('/authentications').send({ refreshToken: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /authentications', () => {
    it('should return 200 on logout', async () => {
      const app = makeApp(
        {},
        { verifyRefreshToken: jest.fn().mockResolvedValue(undefined), deleteToken: jest.fn().mockResolvedValue(undefined) }
      );
      const res = await request(app).delete('/authentications').send({ refreshToken: 'valid_refresh_token' });
      expect(res.statusCode).toBe(200);
    });

    it('should return 400 when deleteAuthentication throws InvariantError', async () => {
      const app = makeApp(
        {},
        { verifyRefreshToken: jest.fn().mockRejectedValue(new InvariantError('refresh token tidak ditemukan')) }
      );
      const res = await request(app).delete('/authentications').send({ refreshToken: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
  });
});
