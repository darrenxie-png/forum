const express = require('express');
const CommentsHandler = require('./handler');

const createCommentsRouter = ({ commentRepository, threadRepository, authMiddleware }) => {
  const router = express.Router();
  const handler = new CommentsHandler({ commentRepository, threadRepository });

  router.post('/threads/:threadId/comments', authMiddleware, handler.postCommentHandler);
  router.delete('/threads/:threadId/comments/:commentId', authMiddleware, handler.deleteCommentHandler);

  return router;
};

module.exports = createCommentsRouter;
