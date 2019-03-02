import { store } from 'store';

describe('store', () => {
  it('should have a store', () => {
    expect(store.getState()).toMatchSnapshot();
  });
});
