const express = require('express');
const RepliesHandler = require('./handler');

const createRepliesRouter = ({ replyRepository, commentRepository, threadRepository, authMiddleware }) => {
  const router = express.Router();
  const handler = new RepliesHandler({ replyRepository, commentRepository, threadRepository });

  router.post('/threads/:threadId/comments/:commentId/replies', authMiddleware, handler.postReplyHandler);
  router.delete('/threads/:threadId/comments/:commentId/replies/:replyId', authMiddleware, handler.deleteReplyHandler);

  return router;
};

module.exports = createRepliesRouter;
