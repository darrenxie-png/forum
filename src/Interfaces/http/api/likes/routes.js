const express = require('express');
const LikesHandler = require('./handler');

const createLikesRouter = ({ likeRepository, commentRepository, threadRepository, authMiddleware }) => {
  const router = express.Router();
  const handler = new LikesHandler({ likeRepository, commentRepository, threadRepository });

  router.put('/threads/:threadId/comments/:commentId/likes', authMiddleware, handler.putLikeHandler);

  return router;
};

module.exports = createLikesRouter;
