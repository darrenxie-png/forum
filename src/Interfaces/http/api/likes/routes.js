const LikesHandler = require('./handler');

const likesRoutes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikeHandler,
    options: { auth: 'forum_jwt' },
  },
];

module.exports = likesRoutes;
