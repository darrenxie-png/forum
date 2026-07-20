const InvariantError = require('../../../Commons/exceptions/InvariantError');

class CreateComment {
  constructor({ content, threadId, owner }) {
    this._verifyPayload({ content, threadId, owner });
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    }
    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    }
  }
}

module.exports = CreateComment;
