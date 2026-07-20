const express = require('express');
const ThreadsHandler = require('./handler');

const createThreadsRouter = ({ threadRepository, commentRepository, replyRepository, likeRepository, authMiddleware }) => {
  const router = express.Router();
  const handler = new ThreadsHandler({ threadRepository, commentRepository, replyRepository, likeRepository });

  router.post('/threads', authMiddleware, handler.postThreadHandler);
  router.get('/threads/:threadId', handler.getThreadByIdHandler);

  return router;
};

module.exports = createThreadsRouter;
