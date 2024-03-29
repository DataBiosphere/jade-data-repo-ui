import { CloudPlatform, DatasetModel } from 'generated/tdr';
import { getCloudPlatform, urlEncodeParams } from './utilsTs';

describe('utilsTs', () => {
  it('should render a simple url parameter correctly', () => {
    expect(urlEncodeParams({ foo: 'bar' })).to.equal('foo=bar');
  });
  it('should render many simple url parameters correctly', () => {
    expect(urlEncodeParams({ foo: 'bar', a: 0, b: false })).to.equal('foo=bar&a=0&b=false');
  });
  it('should render many simple url parameters correctly in different order', () => {
    expect(urlEncodeParams({ b: false, foo: 'bar', a: 0 })).to.equal('b=false&foo=bar&a=0');
  });
  it('should encode url parameters correctly', () => {
    expect(urlEncodeParams({ foo: 'åéîøü¥' })).to.equal('foo=%C3%A5%C3%A9%C3%AE%C3%B8%C3%BC%C2%A5');
  });
  it('returns valid cloud platform', () => {
    const dataset: DatasetModel = {
      name: 'mydataset',
      storage: [{ cloudPlatform: 'azure' }],
    } as DatasetModel;
    expect(getCloudPlatform(dataset)).to.equal(CloudPlatform.Azure);
  });
});
