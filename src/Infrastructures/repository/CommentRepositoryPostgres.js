const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, threadId, owner }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date, false],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_deleted
             FROM comments c
             LEFT JOIN users u ON c.owner = u.id
             WHERE c.thread_id = $1
             ORDER BY c.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyCommentExists(commentId) {
    const query = { text: 'SELECT id FROM comments WHERE id = $1', values: [commentId] };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');
  }

  async verifyCommentOwner(commentId, owner) {
    const query = { text: 'SELECT owner FROM comments WHERE id = $1', values: [commentId] };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');
    if (result.rows[0].owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = CommentRepositoryPostgres;
