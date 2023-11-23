class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.title = payload.title;
    this.body = payload.body;
    this.created = payload.created;
  }

  _verifyPayload(payload) {
    const { id, owner, title, body, created } = payload;

    if (!id || !owner || !title || !body || !created) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof owner !== 'string'
        || typeof title !== 'string'
        || typeof body !== 'string'
        || typeof created !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
