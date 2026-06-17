require('dotenv').config();
const { nanoid } = require('nanoid');

const pool = require('../Infrastructures/database/postgres/pool');
const createServer = require('../Infrastructures/http/createServer');

const UserRepositoryPostgres = require('../Infrastructures/repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../Infrastructures/repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../Infrastructures/repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../Infrastructures/repository/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('../Infrastructures/repository/LikeRepositoryPostgres');

const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../Infrastructures/security/BcryptPasswordHash');
const JwtTokenManager = require('../Infrastructures/security/JwtTokenManager');

const userRepository = new UserRepositoryPostgres(pool, nanoid);
const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
const likeRepository = new LikeRepositoryPostgres(pool, nanoid);

const passwordHash = new BcryptPasswordHash(bcrypt);
const authenticationTokenManager = new JwtTokenManager();

const init = async () => {
  const server = await createServer({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
