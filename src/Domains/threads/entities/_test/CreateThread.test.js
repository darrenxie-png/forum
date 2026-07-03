const CreateThread = require('../CreateThread');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('CreateThread', () => {
  it('should throw InvariantError when payload missing property', () => {
    expect(() => new CreateThread({ title: 'Title', body: 'Body' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new CreateThread({ title: 123, body: 'Body', owner: 'user-1' })).toThrow(InvariantError);
  });
  it('should create CreateThread correctly', () => {
    const thread = new CreateThread({ title: 'Test', body: 'Body', owner: 'user-1' });
    expect(thread.title).toBe('Test');
    expect(thread.body).toBe('Body');
    expect(thread.owner).toBe('user-1');
  });
});
