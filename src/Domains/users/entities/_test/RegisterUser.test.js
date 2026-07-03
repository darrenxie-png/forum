const RegisterUser = require('../RegisterUser');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('RegisterUser', () => {
  it('should throw InvariantError when payload missing property', () => {
    expect(() => new RegisterUser({ username: 'user', password: 'pass' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new RegisterUser({ username: 123, password: 'pass', fullname: 'Full' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when username > 50 chars', () => {
    expect(() => new RegisterUser({ username: 'a'.repeat(51), password: 'pass', fullname: 'Full' })).toThrow(InvariantError);
  });
  it('should throw InvariantError when username has forbidden chars', () => {
    expect(() => new RegisterUser({ username: 'user name', password: 'pass', fullname: 'Full' })).toThrow(InvariantError);
  });
  it('should create RegisterUser correctly', () => {
    const user = new RegisterUser({ username: 'darren', password: 'secret', fullname: 'Darren Dev' });
    expect(user.username).toBe('darren');
    expect(user.password).toBe('secret');
    expect(user.fullname).toBe('Darren Dev');
  });
});
