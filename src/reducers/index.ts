import userReducer, { UserState, initialUserState } from './user';
import snapshotReducer, { SnapshotState, initialSnapshotState } from './snapshot';
import datasetReducer, { DatasetState, initialDatasetState } from './dataset';
import jobReducer, { JobState, initialJobState } from './job';
import configurationReducer, {
  ConfigurationState,
  initialConfigurationState,
} from './configuration';
import queryReducer, { QueryState, initialQueryState } from './query';
import statusReducer, { StatusState, initialStatusState } from './status';
import profileReducer, { ProfileState, initialProfileState } from './profile';
import journalReducer, { initialJournalState, JournalState } from './journal';

export interface TdrState {
  user: UserState;
  snapshots: SnapshotState;
  datasets: DatasetState;
  jobs: JobState;
  journals: JournalState;
  configuration: ConfigurationState;
  query: QueryState;
  status: StatusState;
  profiles: ProfileState;
}

/**
 * Initial global state for the TDR UI
 */
export const initialTdrState: TdrState = {
  user: initialUserState,
  snapshots: initialSnapshotState,
  datasets: initialDatasetState,
  jobs: initialJobState,
  journals: initialJournalState,
  configuration: initialConfigurationState,
  query: initialQueryState,
  status: initialStatusState,
  profiles: initialProfileState,
};

export default {
  ...userReducer,
  ...snapshotReducer,
  ...datasetReducer,
  ...jobReducer,
  ...journalReducer,
  ...configurationReducer,
  ...queryReducer,
  ...statusReducer,
  ...profileReducer,
};
