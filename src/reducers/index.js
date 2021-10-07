import user from './user';
import snapshot from './snapshot';
import dataset from './dataset';
import job from './job';
import configuration from './configuration';
import query from './query';
import status from './status';
import profile from './profile';

export default {
  ...user,
  ...snapshot,
  ...dataset,
  ...job,
  ...configuration,
  ...query,
  ...status,
  ...profile
};
