const LikesHandler = require('./handler');
const likesRoutes = require('./routes');

const likesPlugin = {
  name: 'likes',
  register: async (server, { likeRepository, commentRepository, threadRepository }) => {
    const handler = new LikesHandler({ likeRepository, commentRepository, threadRepository });
    server.route(likesRoutes(handler));
  },
};

module.exports = likesPlugin;
