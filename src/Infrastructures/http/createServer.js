require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const createUsersRouter = require('../../Interfaces/http/api/users/routes');
const createAuthenticationsRouter = require('../../Interfaces/http/api/authentications/routes');
const createThreadsRouter = require('../../Interfaces/http/api/threads/routes');
const createCommentsRouter = require('../../Interfaces/http/api/comments/routes');
const createRepliesRouter = require('../../Interfaces/http/api/replies/routes');
const createLikesRouter = require('../../Interfaces/http/api/likes/routes');

const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

const createServer = ({
  userRepository,
  authenticationRepository,
  authenticationTokenManager,
  passwordHash,
  threadRepository,
  commentRepository,
  replyRepository,
  likeRepository,
}) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(rateLimiter);

  const verifyAuth = authMiddleware(jwt);

  app.use(createUsersRouter({ userRepository, passwordHash }));
  app.use(
    createAuthenticationsRouter({
      userRepository,
      authenticationRepository,
      authenticationTokenManager,
      passwordHash,
    })
  );
  app.use(
    createThreadsRouter({
      threadRepository,
      commentRepository,
      replyRepository,
      likeRepository,
      authMiddleware: verifyAuth,
    })
  );
  app.use(
    createCommentsRouter({
      commentRepository,
      threadRepository,
      authMiddleware: verifyAuth,
    })
  );
  app.use(
    createRepliesRouter({
      replyRepository,
      commentRepository,
      threadRepository,
      authMiddleware: verifyAuth,
    })
  );
  app.use(
    createLikesRouter({
      likeRepository,
      commentRepository,
      threadRepository,
      authMiddleware: verifyAuth,
    })
  );

  app.use((req, res) => {
    res.status(404).json({ status: 'fail', message: 'Not Found' });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createServer;
