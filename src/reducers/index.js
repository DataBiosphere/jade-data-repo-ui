import user from './user';
import snapshot from './snapshot';
import dataset from './dataset';
import job from './job';
import configuration from './configuration';
import query from './query';
import status from './status';

export default {
  ...user,
  ...snapshot,
  ...dataset,
  ...job,
  ...configuration,
  ...query,
  ...status,
};
