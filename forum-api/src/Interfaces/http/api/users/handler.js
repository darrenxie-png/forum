const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = new AddUserUseCase({
      userRepository: this._userRepository,
      passwordHash: this._passwordHash,
    });
    const addedUser = await addUserUseCase.execute(request.payload);
    return h.response({ status: 'success', data: { addedUser } }).code(201);
  }
}

module.exports = UsersHandler;
