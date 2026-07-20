const request = require('supertest');
const jwt = require('jsonwebtoken');
const createServer = require('../../../../../Infrastructures/http/createServer');
const AuthorizationError = require('../../../../../Commons/exceptions/AuthorizationError');

process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_min32chars';

const getAccessToken = () => jwt.sign({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

describe('Comments API', () => {
  const makeApp = (threadOverrides = {}, commentOverrides = {}) => {
    const mockThreadRepository = { verifyThreadExists: jest.fn(), addThread: jest.fn(), getThreadById: jest.fn(), ...threadOverrides };
    const mockCommentRepository = {
      addComment: jest.fn(), deleteComment: jest.fn(), verifyCommentExists: jest.fn(),
      verifyCommentOwner: jest.fn(), getCommentsByThreadId: jest.fn().mockResolvedValue([]),
      ...commentOverrides,
    };
    return createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: { getRepliesByCommentId: jest.fn().mockResolvedValue([]) },
      likeRepository: { getLikeCountByCommentId: jest.fn().mockResolvedValue(0) },
    });
  };

  describe('POST /threads/:threadId/comments', () => {
    it('should return 201 and added comment', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { addComment: jest.fn().mockResolvedValue({ id: 'comment-123', content: 'A comment', owner: 'user-123' }) }
      );
      const res = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ content: 'A comment' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.addedComment.id).toBe('comment-123');
    });

    it('should return 401 when no auth', async () => {
      const res = await request(makeApp()).post('/threads/thread-123/comments').send({ content: 'A comment' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 500 when postComment throws error', async () => {
      const app = makeApp({ verifyThreadExists: jest.fn().mockRejectedValue(new Error('server error')) });
      const res = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ content: 'A comment' });
      expect(res.statusCode).toBe(500);
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId', () => {
    it('should return 200 on delete', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        {
          verifyCommentExists: jest.fn().mockResolvedValue(undefined),
          verifyCommentOwner: jest.fn().mockResolvedValue(undefined),
          deleteComment: jest.fn().mockResolvedValue(undefined),
        }
      );
      const res = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 403 when deleteComment throws AuthorizationError', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        {
          verifyCommentExists: jest.fn().mockResolvedValue(undefined),
          verifyCommentOwner: jest.fn().mockRejectedValue(new AuthorizationError('forbidden')),
        }
      );
      const res = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(403);
    });
  });
});
