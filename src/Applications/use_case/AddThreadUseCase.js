const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(addThreadPayload) {
    const addThread = new AddThread(addThreadPayload);
    return await this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
