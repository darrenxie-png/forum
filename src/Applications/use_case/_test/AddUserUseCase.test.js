const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrate AddUser correctly', async () => {
    const mockUserRepository = {
      verifyAvailableUsername: jest.fn().mockResolvedValue(undefined),
      addUser: jest.fn().mockResolvedValue({ id: 'user-1', username: 'darren', fullname: 'Darren Dev' }),
    };
    const mockPasswordHash = { hash: jest.fn().mockResolvedValue('hashed_password') };
    const useCase = new AddUserUseCase({ userRepository: mockUserRepository, passwordHash: mockPasswordHash });
    const result = await useCase.execute({ username: 'darren', password: 'secret', fullname: 'Darren Dev' });
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith('darren');
    expect(mockPasswordHash.hash).toHaveBeenCalledWith('secret');
    expect(result.id).toBe('user-1');
  });
});
