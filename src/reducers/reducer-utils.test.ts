import { getAuthDomain } from './reducer-utils';

describe('reducerUtils', () => {
  it('should return an empty array', () => {
    const authDomains: string | undefined = undefined;
    const result: string[] = getAuthDomain(authDomains);
    expect(result).to.deep.equal([]);
  });
  it('should return a populated array', () => {
    const authDomains: string | null = 'authDomain1';
    const result: string[] = getAuthDomain(authDomains);
    expect(result).to.deep.equal(['authDomain1']);
  });
});
