const InvariantError = require('../../../Commons/exceptions/InvariantError');

class CreateThread {
  constructor({ title, body, owner }) {
    this._verifyPayload({ title, body, owner });
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new InvariantError('Tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    }
    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('Tidak dapat membuat thread baru karena tipe data tidak sesuai');
    }
  }
}

module.exports = CreateThread;
