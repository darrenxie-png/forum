const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      const addUserUseCase = new AddUserUseCase({
        userRepository: this._userRepository,
        passwordHash: this._passwordHash,
      });
      const addedUser = await addUserUseCase.execute(req.body);
      return res.status(201).json({ status: 'success', data: { addedUser } });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UsersHandler;
