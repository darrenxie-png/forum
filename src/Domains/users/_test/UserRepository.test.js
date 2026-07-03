const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract method', async () => {
    const repo = new UserRepository();
    await expect(repo.addUser({})).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.verifyAvailableUsername('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.getPasswordByUsername('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.getIdByUsername('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
