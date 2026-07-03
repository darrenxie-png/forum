require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const usersPlugin = require('../../Interfaces/http/api/users');
const authenticationsPlugin = require('../../Interfaces/http/api/authentications');
const threadsPlugin = require('../../Interfaces/http/api/threads');
const commentsPlugin = require('../../Interfaces/http/api/comments');
const repliesPlugin = require('../../Interfaces/http/api/replies');
const likesPlugin = require('../../Interfaces/http/api/likes');

const ClientError = require('../../Commons/exceptions/ClientError');

const createServer = async ({
  userRepository,
  authenticationRepository,
  authenticationTokenManager,
  passwordHash,
  threadRepository,
  commentRepository,
  replyRepository,
  likeRepository,
}) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: { cors: { origin: ['*'] } },
  });

  await server.register(Jwt);

  server.auth.strategy('forum_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: { aud: false, iss: false, sub: false },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  await server.register([
    { plugin: usersPlugin, options: { userRepository, passwordHash } },
    { plugin: authenticationsPlugin, options: { userRepository, authenticationRepository, authenticationTokenManager, passwordHash } },
    { plugin: threadsPlugin, options: { threadRepository, commentRepository, replyRepository, likeRepository } },
    { plugin: commentsPlugin, options: { commentRepository, threadRepository } },
    { plugin: repliesPlugin, options: { replyRepository, commentRepository, threadRepository } },
    { plugin: likesPlugin, options: { likeRepository, commentRepository, threadRepository } },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({ status: 'fail', message: response.message }).code(response.statusCode);
      }
      if (!response.isServer) return h.continue;
      console.error(response);
      return h.response({ status: 'error', message: 'terjadi kegagalan pada server kami' }).code(500);
    }
    return h.continue;
  });

  return server;
};

module.exports = createServer;
