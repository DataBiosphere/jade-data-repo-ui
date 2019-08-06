import app from './app';
import user from './user';
import dataset from './dataset';
import study from './study';
import job from './job';
import configuration from './configuration';

export default {
  ...app,
  ...user,
  ...dataset,
  ...study,
  ...job,
  ...configuration,
};
