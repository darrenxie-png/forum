const createServer = require('../../../../../Infrastructures/http/createServer');

describe('Users API', () => {
  const mockUserRepository = {
    verifyAvailableUsername: jest.fn(),
    addUser: jest.fn(),
    getPasswordByUsername: jest.fn(),
    getIdByUsername: jest.fn(),
  };
  const mockPasswordHash = {
    hash: jest.fn(),
    comparePassword: jest.fn(),
  };

  const makeServer = () =>
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
      mockUserRepository.addUser.mockResolvedValue({
        id: 'user-123',
        username: 'darren',
        fullname: 'Darren Dev',
      });

      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'darren', password: 'secret', fullname: 'Darren Dev' },
      });

      expect(response.statusCode).toBe(201);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.addedUser.id).toBe('user-123');
    });

    it('should return 400 when payload is missing', async () => {
      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'darren' },
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
