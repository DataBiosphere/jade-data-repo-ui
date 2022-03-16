interface UserModel {
  token: string;
  tokenExpiration: number;
}

interface SnapshotsModel {
  snapshots: Array<any>;
}

interface QueryModel {
  baseQuery: string;
  delay: boolean;
  filterData: any;
  filterStatement: string;
  pageSize: number;
  projectId: string;
  queryResults: any;
  orderBy: string;
  polling: boolean;
  resultsCount: number;
}

interface DatasetsModel {
  datasets: Array<any>;
  dataset: any;
  datasetsCount: number;
  datasetPolicies: Array<any>;
  userRoles: Array<any>;
  datasetSnapshots: Array<any>;
  datasetSnapshotsCount: number;
}

interface ConfigurationModel {
  samUrl: string;
}

export interface State {
  user: UserModel;
  snapshots: SnapshotsModel;
  query: QueryModel;
  datasets: DatasetsModel;
  configuration: ConfigurationModel;
}
