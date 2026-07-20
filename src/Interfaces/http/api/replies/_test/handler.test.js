const request = require('supertest');
const jwt = require('jsonwebtoken');
const createServer = require('../../../../../Infrastructures/http/createServer');
const AuthorizationError = require('../../../../../Commons/exceptions/AuthorizationError');

process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_min32chars';

const getAccessToken = () => jwt.sign({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

describe('Replies API', () => {
  const makeApp = (threadOverrides = {}, commentOverrides = {}, replyOverrides = {}) => {
    return createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: { verifyThreadExists: jest.fn(), addThread: jest.fn(), getThreadById: jest.fn(), ...threadOverrides },
      commentRepository: {
        verifyCommentExists: jest.fn(), getCommentsByThreadId: jest.fn().mockResolvedValue([]),
        addComment: jest.fn(), deleteComment: jest.fn(), verifyCommentOwner: jest.fn(),
        ...commentOverrides,
      },
      replyRepository: {
        addReply: jest.fn(), deleteReply: jest.fn(),
        verifyReplyExists: jest.fn(), verifyReplyOwner: jest.fn(), getRepliesByCommentId: jest.fn().mockResolvedValue([]),
        ...replyOverrides,
      },
      likeRepository: { getLikeCountByCommentId: jest.fn().mockResolvedValue(0) },
    });
  };

  describe('POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should return 201 and added reply', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { verifyCommentExists: jest.fn().mockResolvedValue(undefined) },
        { addReply: jest.fn().mockResolvedValue({ id: 'reply-123', content: 'A reply', owner: 'user-123' }) }
      );
      const res = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ content: 'A reply' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.addedReply.id).toBe('reply-123');
    });

    it('should return 500 when postReply throws error', async () => {
      const app = makeApp({ verifyThreadExists: jest.fn().mockRejectedValue(new Error('server error')) });
      const res = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ content: 'A reply' });
      expect(res.statusCode).toBe(500);
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should return 200 on delete', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { verifyCommentExists: jest.fn().mockResolvedValue(undefined) },
        {
          verifyReplyExists: jest.fn().mockResolvedValue(undefined),
          verifyReplyOwner: jest.fn().mockResolvedValue(undefined),
          deleteReply: jest.fn().mockResolvedValue(undefined),
        }
      );
      const res = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 403 when deleteReply throws AuthorizationError', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { verifyCommentExists: jest.fn().mockResolvedValue(undefined) },
        {
          verifyReplyExists: jest.fn().mockResolvedValue(undefined),
          verifyReplyOwner: jest.fn().mockRejectedValue(new AuthorizationError('forbidden')),
        }
      );
      const res = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(403);
    });
  });
});
