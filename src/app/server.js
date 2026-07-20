require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const pool = require('../Infrastructures/database/postgres/pool');
const createServer = require('../Infrastructures/http/createServer');

const UserRepositoryPostgres = require('../Infrastructures/repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../Infrastructures/repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../Infrastructures/repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../Infrastructures/repository/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('../Infrastructures/repository/LikeRepositoryPostgres');

const BcryptPasswordHash = require('../Infrastructures/security/BcryptPasswordHash');
const JwtTokenManager = require('../Infrastructures/security/JwtTokenManager');

const userRepository = new UserRepositoryPostgres(pool, nanoid);
const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
const likeRepository = new LikeRepositoryPostgres(pool, nanoid);

const passwordHash = new BcryptPasswordHash(bcrypt);
const authenticationTokenManager = new JwtTokenManager(jwt);

const app = createServer({
  userRepository,
  authenticationRepository,
  authenticationTokenManager,
  passwordHash,
  threadRepository,
  commentRepository,
  replyRepository,
  likeRepository,
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
