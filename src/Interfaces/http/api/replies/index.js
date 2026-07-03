const RepliesHandler = require('./handler');
const repliesRoutes = require('./routes');

const repliesPlugin = {
  name: 'replies',
  register: async (server, { replyRepository, commentRepository, threadRepository }) => {
    const handler = new RepliesHandler({ replyRepository, commentRepository, threadRepository });
    server.route(repliesRoutes(handler));
  },
};

module.exports = repliesPlugin;
