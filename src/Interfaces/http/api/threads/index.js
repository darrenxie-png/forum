const ThreadsHandler = require('./handler');
const threadsRoutes = require('./routes');

const threadsPlugin = {
  name: 'threads',
  register: async (server, { threadRepository, commentRepository, replyRepository, likeRepository }) => {
    const handler = new ThreadsHandler({ threadRepository, commentRepository, replyRepository, likeRepository });
    server.route(threadsRoutes(handler));
  },
};

module.exports = threadsPlugin;
