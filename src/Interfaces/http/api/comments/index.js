const CommentsHandler = require('./handler');
const commentsRoutes = require('./routes');

const commentsPlugin = {
  name: 'comments',
  register: async (server, { commentRepository, threadRepository }) => {
    const handler = new CommentsHandler({ commentRepository, threadRepository });
    server.route(commentsRoutes(handler));
  },
};

module.exports = commentsPlugin;
