const CreateComment = require('../CreateComment');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('CreateComment', () => {
  it('should throw InvariantError when payload missing property', () => {
    expect(() => new CreateComment({ content: 'Content', threadId: 'thread-1' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new CreateComment({ content: 123, threadId: 'thread-1', owner: 'user-1' })).toThrow(InvariantError);
  });
  it('should create CreateComment correctly', () => {
    const comment = new CreateComment({ content: 'A comment', threadId: 'thread-1', owner: 'user-1' });
    expect(comment.content).toBe('A comment');
  });
});
