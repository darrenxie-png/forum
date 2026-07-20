const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ content, commentId, threadId, owner }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, commentId, threadId, owner, content, date, false],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.id, u.username, r.date, r.content, r.is_deleted
             FROM replies r
             LEFT JOIN users u ON r.owner = u.id
             WHERE r.comment_id = $1
             ORDER BY r.date ASC`,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyReplyExists(replyId) {
    const query = { text: 'SELECT id FROM replies WHERE id = $1', values: [replyId] };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('reply tidak ditemukan');
  }

  async verifyReplyOwner(replyId, owner) {
    const query = { text: 'SELECT owner FROM replies WHERE id = $1', values: [replyId] };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('reply tidak ditemukan');
    if (result.rows[0].owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = ReplyRepositoryPostgres;
