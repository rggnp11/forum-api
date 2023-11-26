const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, addThreadPayload) {
    const addThread = new AddThread(addThreadPayload);
    return await this._threadRepository.addThread(userId, addThread);
  }
}

module.exports = AddThreadUseCase;
