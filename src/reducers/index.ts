import userReducer, { UserState, initialUserState } from './user';
import snapshotReducer, { SnapshotState, initialSnapshotState } from './snapshot';
import datasetReducer, { DatasetState, initialDatasetState } from './dataset';
import snapshotAccessRequestReducer, {
  SnapshotAccessRequestState,
  initialSnapshotAccessRequestState,
} from './snapshot-access-request';
import jobReducer, { JobState, initialJobState } from './job';
import configurationReducer, {
  ConfigurationState,
  initialConfigurationState,
} from './configuration';
import queryReducer, { QueryState, initialQueryState } from './query';
import statusReducer, { StatusState, initialStatusState } from './status';
import profileReducer, { ProfileState, initialProfileState } from './profile';
import journalReducer, { initialJournalState, JournalState } from './journal';
import duosReducer, { DuosState, initialDuosState } from './duos';

export interface TdrState {
  user: UserState;
  snapshots: SnapshotState;
  datasets: DatasetState;
  snapshotAccessRequests: SnapshotAccessRequestState;
  jobs: JobState;
  journals: JournalState;
  configuration: ConfigurationState;
  query: QueryState;
  status: StatusState;
  profiles: ProfileState;
  duos: DuosState;
}

/**
 * Initial global state for the TDR UI
 */
export const initialTdrState: TdrState = {
  user: initialUserState,
  snapshots: initialSnapshotState,
  datasets: initialDatasetState,
  snapshotAccessRequests: initialSnapshotAccessRequestState,
  jobs: initialJobState,
  journals: initialJournalState,
  configuration: initialConfigurationState,
  query: initialQueryState,
  status: initialStatusState,
  profiles: initialProfileState,
  duos: initialDuosState,
};

export default {
  ...userReducer,
  ...snapshotReducer,
  ...datasetReducer,
  ...snapshotAccessRequestReducer,
  ...jobReducer,
  ...journalReducer,
  ...configurationReducer,
  ...queryReducer,
  ...statusReducer,
  ...profileReducer,
  ...duosReducer,
};
