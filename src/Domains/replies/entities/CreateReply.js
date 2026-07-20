const InvariantError = require('../../../Commons/exceptions/InvariantError');

class CreateReply {
  constructor({ content, commentId, threadId, owner }) {
    this._verifyPayload({ content, commentId, threadId, owner });
    this.content = content;
    this.commentId = commentId;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, commentId, threadId, owner }) {
    if (!content || !commentId || !threadId || !owner) {
      throw new InvariantError('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    }
    if (typeof content !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    }
  }
}

module.exports = CreateReply;
