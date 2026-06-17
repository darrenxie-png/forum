const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate AddThread correctly', async () => {
    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue({ id: 'thread-1', title: 'Test', owner: 'user-1' }),
    };

    const useCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const result = await useCase.execute({ title: 'Test', body: 'Body', owner: 'user-1' });

    expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 'thread-1', title: 'Test', owner: 'user-1' });
  });
});
