const CreateReply = require('../CreateReply');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('CreateReply', () => {
  it('should throw InvariantError when payload missing property', () => {
    expect(() => new CreateReply({ content: 'Content', commentId: 'c-1', threadId: 't-1' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new CreateReply({ content: 123, commentId: 'c-1', threadId: 't-1', owner: 'u-1' })).toThrow(InvariantError);
  });
  it('should create CreateReply correctly', () => {
    const reply = new CreateReply({ content: 'A reply', commentId: 'c-1', threadId: 't-1', owner: 'u-1' });
    expect(reply.content).toBe('A reply');
  });
});
