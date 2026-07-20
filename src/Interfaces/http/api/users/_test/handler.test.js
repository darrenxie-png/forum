const request = require('supertest');
const createServer = require('../../../../../Infrastructures/http/createServer');

describe('Users API', () => {
  const mockUserRepository = {
    verifyAvailableUsername: jest.fn(),
    addUser: jest.fn(),
    getPasswordByUsername: jest.fn(),
    getIdByUsername: jest.fn(),
  };
  const mockPasswordHash = { hash: jest.fn(), comparePassword: jest.fn() };

  const makeApp = () =>
    createServer({
      userRepository: mockUserRepository,
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: mockPasswordHash,
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
      likeRepository: {},
    });

  beforeEach(() => jest.clearAllMocks());

  describe('POST /users', () => {
    it('should return 201 and added user', async () => {
      mockUserRepository.verifyAvailableUsername.mockResolvedValue(undefined);
      mockPasswordHash.hash.mockResolvedValue('hashed_password');
      mockUserRepository.addUser.mockResolvedValue({ id: 'user-123', username: 'darren', fullname: 'Darren Dev' });

      const res = await request(makeApp())
        .post('/users')
        .send({ username: 'darren', password: 'secret', fullname: 'Darren Dev' });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.addedUser.id).toBe('user-123');
    });

    it('should return 400 when payload is missing', async () => {
      const res = await request(makeApp()).post('/users').send({ username: 'darren' });
      expect(res.statusCode).toBe(400);
    });
  });
});
