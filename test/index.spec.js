describe('index/app', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'production';
  });

  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should have mounted the app', () => {
    require('index');
    expect(document.body.children.length).toBeGreaterThan(0);
  });
});
