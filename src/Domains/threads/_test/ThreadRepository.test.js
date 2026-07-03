const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract method', async () => {
    const repo = new ThreadRepository();
    await expect(repo.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.getThreadById('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repo.verifyThreadExists('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
