import app from './app';
import user from './user';
import snapshot from './snapshot';
import dataset from './dataset';
import job from './job';
import configuration from './configuration';

export default {
  ...app,
  ...user,
  ...snapshot,
  ...dataset,
  ...job,
  ...configuration,
};
