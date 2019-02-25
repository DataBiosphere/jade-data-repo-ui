import { logIn, logOut } from 'actions/user';

describe('App', () => {
  it('login should return an action', () => {
    expect(logIn()).toMatchSnapshot();
  });

  it('logOut should return an action', () => {
    expect(logOut()).toMatchSnapshot();
  });
});
