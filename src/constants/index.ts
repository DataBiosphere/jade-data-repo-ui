import _ from 'lodash';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export enum ActionTypes {
  SWITCH_MENU = 'SWITCH_MENU',
  SHOW_ALERT = 'SHOW_ALERT',
  HIDE_ALERT = 'HIDE_ALERT',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE',
  USER_REFRESH = 'USER_REFRESH',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE',
  GET_USER_STATUS = 'GET_USER_STATUS',
  GET_USER_STATUS_SUCCESS = 'GET_USER_STATUS_SUCCESS',
  GET_USER_STATUS_FAILURE = 'GET_USER_STATUS_FAILURE',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_ROWS_PER_PAGE = 'CHANGE_ROWS_PER_PAGE',
  CREATE_SNAPSHOT = 'CREATE_SNAPSHOT',
  CREATE_SNAPSHOT_JOB = 'CREATE_SNAPSHOT_JOB',
  CREATE_SNAPSHOT_SUCCESS = 'CREATE_SNAPSHOT_SUCCESS',
  CREATE_SNAPSHOT_FAILURE = 'CREATE_SNAPSHOT_FAILURE',
  CREATE_SNAPSHOT_EXCEPTION = 'CREATE_SNAPSHOT_EXCEPTION',
  EXPORT_SNAPSHOT_EXCEPTION = 'EXPORT_SNAPSHOT_EXCEPTION',
  EXPORT_SNAPSHOT = 'EXPORT_SNAPSHOT',
  EXPORT_SNAPSHOT_START = 'EXPORT_SNAPSHOT_START',
  EXPORT_SNAPSHOT_JOB = 'EXPORT_SNAPSHOT_JOB',
  EXPORT_SNAPSHOT_SUCCESS = 'EXPORT_SNAPSHOT_SUCCESS',
  EXPORT_SNAPSHOT_FAILURE = 'EXPORT_SNAPSHOT_FAILURE',
  RESET_SNAPSHOT_EXPORT = 'RESET_SNAPSHOT_EXPORT',
  RESET_SNAPSHOT_EXPORT_DATA = 'RESET_SNAPSHOT_EXPORT_DATA',
  CREATE_DATASET = 'CREATE_DATASET',
  CREATE_DATASET_SUCCESS = 'CREATE_DATASET_SUCCESS',
  CREATE_DATASET_ERROR = 'CREATE_DATASET_ERROR',
  REFRESH_DATASETS = 'REFRESH_DATASETS',
  GET_DATASETS = 'GET_DATASETS',
  GET_DATASETS_SUCCESS = 'GET_DATASETS_SUCCESS',
  GET_DATASETS_FAILURE = 'GET_DATASETS_FAILURE',
  GET_DATASET_BY_ID = 'GET_DATASET_BY_ID',
  GET_DATASET_BY_ID_SUCCESS = 'GET_DATASET_BY_ID_SUCCESS',
  GET_DATASET_SNAPSHOTS_FAILURE = 'GET_DATASET_SNAPSHOTS_FAILURE',
  GET_DATASET_SNAPSHOTS_SUCCESS = 'GET_DATASET_SNAPSHOTS_SUCCESS',
  GET_DATASET_SNAPSHOTS = 'GET_DATASET_SNAPSHOTS',
  REFRESH_SNAPSHOTS = 'REFRESH_SNAPSHOTS',
  GET_SNAPSHOTS = 'GET_SNAPSHOTS',
  GET_SNAPSHOTS_SUCCESS = 'GET_SNAPSHOTS_SUCCESS',
  GET_SNAPSHOTS_FAILURE = 'GET_SNAPSHOTS_FAILURE',
  GET_SNAPSHOT_BY_ID = 'GET_SNAPSHOT_BY_ID',
  GET_SNAPSHOT_BY_ID_SUCCESS = 'GET_SNAPSHOT_BY_ID_SUCCESS',
  GET_SNAPSHOT_POLICY = 'GET_SNAPSHOT_POLICY',
  GET_SNAPSHOT_POLICY_SUCCESS = 'GET_SNAPSHOT_POLICY_SUCCESS',
  GET_SNAPSHOT_POLICY_FAILURE = 'GET_SNAPSHOT_POLICY_FAILURE',
  ADD_SNAPSHOT_POLICY_MEMBER = 'ADD_SNAPSHOT_POLICY_MEMBER',
  ADD_SNAPSHOT_POLICY_MEMBER_FAILURE = 'ADD_SNAPSHOT_POLICY_MEMBER_FAILURE',
  ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS = 'ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBER = 'REMOVE_SNAPSHOT_POLICY_MEMBER',
  REMOVE_SNAPSHOT_POLICY_MEMBER_FAILURE = 'REMOVE_SNAPSHOT_POLICY_MEMBER_FAILURE',
  REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS = 'REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS',
  GET_USER_SNAPSHOT_ROLES = 'GET_USER_SNAPSHOT_ROLES',
  GET_USER_SNAPSHOT_ROLES_SUCCESS = 'GET_USER_SNAPSHOT_ROLES_SUCCESS',
  GET_DATASET_POLICY = 'GET_DATASET_POLICY',
  GET_DATASET_POLICY_SUCCESS = 'GET_DATASET_POLICY_SUCCESS',
  ADD_DATASET_POLICY_MEMBER = 'ADD_DATASET_POLICY_MEMBER',
  ADD_DATASET_POLICY_MEMBER_FAILURE = 'ADD_DATASET_POLICY_MEMBER_FAILURE',
  ADD_DATASET_POLICY_MEMBER_SUCCESS = 'ADD_DATASET_POLICY_MEMBER_SUCCESS',
  REMOVE_DATASET_POLICY_MEMBER = 'REMOVE_DATASET_POLICY_MEMBER',
  REMOVE_DATASET_POLICY_MEMBER_FAILURE = 'REMOVE_DATASET_POLICY_MEMBER_FAILURE',
  REMOVE_DATASET_POLICY_MEMBER_SUCCESS = 'REMOVE_DATASET_POLICY_MEMBER_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS = 'REMOVE_SNAPSHOT_POLICY_MEMBERS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS_SUCCESS = 'REMOVE_SNAPSHOT_POLICY_MEMBERS_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION = 'REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION',
  GET_USER_DATASET_ROLES = 'GET_USER_DATASET_ROLES',
  GET_USER_DATASET_ROLES_SUCCESS = 'GET_USER_DATASET_ROLES_SUCCESS',
  GET_BILLING_PROFILES = 'GET_BILLING_PROFILES',
  GET_BILLING_PROFILES_SUCCESS = 'GET_BILLING_PROFILES_SUCCESS',
  GET_BILLING_PROFILES_FAILURE = 'GET_BILLING_PROFILES_FAILURE',
  GET_BILLING_PROFILE_BY_ID = 'GET_BILLING_PROFILE_BY_ID',
  GET_BILLING_PROFILE_BY_ID_SUCCESS = 'GET_BILLING_PROFILE_BY_ID_SUCCESS',
  GET_BILLING_PROFILE_BY_ID_EXCEPTION = 'GET_BILLING_PROFILE_BY_ID_EXCEPTION',
  GET_JOBS = 'GET_JOBS',
  GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS',
  GET_JOBS_FAILURE = 'GET_JOBS_FAILURE',
  GET_JOB_RESULT = 'GET_JOB_RESULT',
  GET_JOB_RESULT_SUCCESS = 'GET_JOB_RESULT_SUCCESS',
  GET_JOB_RESULT_FAILURE = 'GET_JOB_RESULT_FAILURE',
  GET_JOB_BY_ID = 'GET_JOB_BY_ID',
  GET_JOB_BY_ID_SUCCESS = 'GET_JOB_BY_ID_SUCCESS',
  GET_JOURNAL_ENTRIES = 'GET_JOURNAL_ENTRIES',
  GET_JOURNAL_ENTRIES_SUCCESS = 'GET_JOURNAL_ENTRIES_SUCCESS',
  GET_JOURNAL_ENTRIES_FAILURE = 'GET_JOURNAL_ENTRIES_FAILURE',
  REFRESH_JOURNAL_ENTRIES = 'REFRESH_JOURNAL_ENTRIES',
  CLEAR_JOB_ID = 'CLEAR_JOB_ID',
  GET_DATASET_TABLE_PREVIEW = 'GET_DATASET_TABLE_PREVIEW',
  GET_DATASET_TABLE_PREVIEW_SUCCESS = 'GET_DATASET_TABLE_PREVIEW_SUCCESS',
  GET_CONFIGURATION_SUCCESS = 'GET_CONFIGURATION_SUCCESS',
  RESET_QUERY = 'RESET_QUERY',
  RUN_QUERY = 'RUN_QUERY',
  RUN_QUERY_SUCCESS = 'RUN_QUERY_SUCCESS',
  QUERY_MENU_SELECT = 'QUERY_MENU_SELECT',
  APPLY_FILTERS = 'APPLY_FILTERS',
  APPLY_FILTERS_SUCCESS = 'APPLY_FILTERS_SUCCESS',
  POLL_QUERY = 'POLL_QUERY',
  REFRESH_QUERY = 'REFRESH_QUERY',
  PAGE_QUERY = 'PAGE_QUERY',
  PAGE_QUERY_SUCCESS = 'PAGE_QUERY_SUCCESS',
  PREVIEW_DATA = 'PREVIEW_DATA',
  PREVIEW_DATA_SUCCESS = 'PREVIEW_DATA_SUCCESS',
  PREVIEW_DATA_FAILURE = 'PREVIEW_DATA_FAILURE',
  APPLY_SORT = 'APPLY_SORT',
  RESIZE_COLUMN = 'RESIZE_COLUMN',
  OPEN_SNAPSHOT_DIALOG = 'OPEN_SNAPSHOT_DIALOG',
  COUNT_RESULTS = 'COUNT_RESULTS',
  COUNT_RESULTS_SUCCESS = 'COUNT_RESULTS_SUCCESS',
  SNAPSHOT_CREATE_DETAILS = 'SNAPSHOT_CREATE_DETAILS',
  CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST = 'CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST',
  GET_FEATURES = 'GET_FEATURES',
  GET_FEATURES_SUCCESS = 'GET_FEATURES_SUCCESS',
  GET_SERVER_STATUS_SUCCESS = 'GET_SERVER_STATUS_SUCCESS',
  GET_SERVER_STATUS_FAILURE = 'GET_SERVER_STATUS_FAILURE',
  GET_SERVER_STATUS_DOWN = 'GET_SERVER_STATUS_DOWN',
  PATCH_DATASET = 'PATCH_DATASET',
  PATCH_DATASET_SUCCESS = 'PATCH_DATASET_SUCCESS',
  PATCH_SNAPSHOT = 'PATCH_SNAPSHOT',
  PATCH_SNAPSHOT_SUCCESS = 'PATCH_SNAPSHOT_SUCCESS',
  EXCEPTION = 'EXCEPTION',
}

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export enum Status {
  IDLE = 'idle',
  RUNNING = 'running',
  READY = 'ready',
  SUCCESS = 'success', // should this be succeeded ?
  ERROR = 'error',
}

export enum DbColumns {
  ROW_ID = 'datarepo_row_id',
}

export enum ColumnModes {
  NULLABLE = 'NULLABLE',
  REPEATED = 'REPEATED',
  REQUIRED = 'REQUIRED',
}

export enum SnapshotRoles {
  STEWARD = 'steward',
  READER = 'reader',
  DISCOVERER = 'discoverer',
}

export enum GoogleCloudResource {
  BIGQUERY = 'bigquery',
  FIRESTORE = 'firestore',
  BUCKET = 'bucket',
}

export enum DatasetRoles {
  STEWARD = 'steward',
  CUSTODIAN = 'custodian',
  SNAPSHOT_CREATOR = 'snapshot_creator',
}

export enum IamResourceTypes {
  DATASET = 'dataset',
  SNAPSHOT = 'datasnapshot',
}

export enum DatasetIncludeOptions {
  NONE = 'NONE',
  SCHEMA = 'SCHEMA',
  ACCESS_INFORMATION = 'ACCESS_INFORMATION',
  PROFILE = 'PROFILE',
  DATA_PROJECT = 'DATA_PROJECT',
  STORAGE = 'STORAGE',
}

export enum SnapshotIncludeOptions {
  NONE = 'NONE',
  SOURCES = 'SOURCES',
  TABLES = 'TABLES',
  RELATIONSHIPS = 'RELATIONSHIPS',
  ACCESS_INFORMATION = 'ACCESS_INFORMATION',
  PROFILE = 'PROFILE',
  DATA_PROJECT = 'DATA_PROJECT',
}

export enum BreadcrumbType {
  DATASET = 'dataset',
  SNAPSHOT = 'snapshot',
}

export enum ResourceType {
  DATASET = 'dataset',
  SNAPSHOT = 'snapshot',
  JOB = 'job',
}

/** Shared Defaults */
export const TABLE_DEFAULT_ROWS_PER_PAGE = 100;
export const TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS = [25, 100, 250];
export const TABLE_DEFAULT_SORT_ORDER = 'asc';
export const TABLE_DEFAULT_COLUMN_WIDTH = 300;

const generateGCPRegions: any = () => {
  // settings to generate servers from https://cloud.google.com/compute/docs/regions-zones
  // the list is quite long. The final results will be like:
  // "asia-east1-a", "asia-east1-b", "asia-east1-c", "asia-east2-a", etc.
  const servers = [
    { name: 'asia-east', count: [1, 2] },
    { name: 'asia-northeast', count: [1, 2, 3] },
    { name: 'asia-south', count: [1, 2] },
    { name: 'asia-southeast', count: [1, 2] },
    { name: 'australia-southeast', count: [1, 2] },
    { name: 'europe-central', count: [1, 2] },
    { name: 'europe-north', count: [1] },
    { name: 'europe-southwest', count: [1] },
    { name: 'europe-west', count: [1] },
    { name: 'europe-west', count: [2, 3, 4, 6, 8, 9] },
    { name: 'me-west', count: [1] },
    { name: 'northamerica-northeast', count: [1, 2] },
    { name: 'southamerica-east', count: [1] },
    { name: 'southamerica-west', count: [1] },
    { name: 'us-central', count: [1] },
    { name: 'us-east', count: [1] },
    { name: 'us-east', count: [4, 5] },
    { name: 'us-south', count: [1] },
    { name: 'us-west', count: [1, 2, 3, 4] },
  ];

  return _.flatMap(servers, (serverSettings: any) =>
    _.flatMap(_.map(serverSettings.count, (count: number) => `${serverSettings.name}${count}`)),
  );
};

export const CLOUD_PLATFORMS = {
  gcp: {
    key: 'gcp',
    label: 'Google Cloud Platform',
    regions: generateGCPRegions(),
  },
  azure: {
    key: 'azure',
    label: 'Microsoft Azure',
    regions: [
      { label: 'East US', name: 'eastus' },
      { label: 'East US 2', name: 'eastus2' },
      { label: 'South Central US', name: 'southcentralus' },
      { label: 'West US 2', name: 'westus2' },
      { label: 'West US 3', name: 'westus3' },
      { label: 'Australia East', name: 'australiaeast' },
      { label: 'Southeast Asia', name: 'southeastasia' },
      { label: 'North Europe', name: 'northeurope' },
      { label: 'Sweden Central', name: 'swedencentral' },
      { label: 'UK South', name: 'uksouth' },
      { label: 'West Europe', name: 'westeurope' },
      { label: 'Central US', name: 'centralus' },
      { label: 'South Africa North', name: 'southafricanorth' },
      { label: 'Central India', name: 'centralindia' },
      { label: 'East Asia', name: 'eastasia' },
      { label: 'Japan East', name: 'japaneast' },
      { label: 'Korea Central', name: 'koreacentral' },
      { label: 'Canada Central', name: 'canadacentral' },
      { label: 'France Central', name: 'francecentral' },
      { label: 'Germany West Central', name: 'germanywestcentral' },
      { label: 'Norway East', name: 'norwayeast' },
      { label: 'Switzerland North', name: 'switzerlandnorth' },
      { label: 'UAE North', name: 'uaenorth' },
      { label: 'Brazil South', name: 'brazilsouth' },
      { label: 'East US 2 EUAP', name: 'eastus2euap' },
      { label: 'Qatar Central', name: 'qatarcentral' },
      { label: 'Central US (Stage)', name: 'centralusstage' },
      { label: 'East US (Stage)', name: 'eastusstage' },
      { label: 'East US 2 (Stage)', name: 'eastus2stage' },
      { label: 'North Central US (Stage)', name: 'northcentralusstage' },
      { label: 'South Central US (Stage)', name: 'southcentralusstage' },
      { label: 'West US (Stage)', name: 'westusstage' },
      { label: 'West US 2 (Stage)', name: 'westus2stage' },
      { label: 'Asia', name: 'asia' },
      { label: 'Asia Pacific', name: 'asiapacific' },
      { label: 'Australia', name: 'australia' },
      { label: 'Brazil', name: 'brazil' },
      { label: 'Canada', name: 'canada' },
      { label: 'Europe', name: 'europe' },
      { label: 'France', name: 'france' },
      { label: 'Germany', name: 'germany' },
      { label: 'Global', name: 'global' },
      { label: 'India', name: 'india' },
      { label: 'Japan', name: 'japan' },
      { label: 'Korea', name: 'korea' },
      { label: 'Norway', name: 'norway' },
      { label: 'Singapore', name: 'singapore' },
      { label: 'South Africa', name: 'southafrica' },
      { label: 'Switzerland', name: 'switzerland' },
      { label: 'United Arab Emirates', name: 'uae' },
      { label: 'United Kingdom', name: 'uk' },
      { label: 'United States', name: 'unitedstates' },
      { label: 'United States EUAP', name: 'unitedstateseuap' },
      { label: 'East Asia (Stage)', name: 'eastasiastage' },
      { label: 'Southeast Asia (Stage)', name: 'southeastasiastage' },
      { label: 'East US STG', name: 'eastusstg' },
      { label: 'South Central US STG', name: 'southcentralusstg' },
      { label: 'North Central US', name: 'northcentralus' },
      { label: 'West US', name: 'westus' },
      { label: 'Jio India West', name: 'jioindiawest' },
      { label: 'Central US EUAP', name: 'centraluseuap' },
      { label: 'West Central US', name: 'westcentralus' },
      { label: 'South Africa West', name: 'southafricawest' },
      { label: 'Australia Central', name: 'australiacentral' },
      { label: 'Australia Central 2', name: 'australiacentral2' },
      { label: 'Australia Southeast', name: 'australiasoutheast' },
      { label: 'Japan West', name: 'japanwest' },
      { label: 'Jio India Central', name: 'jioindiacentral' },
      { label: 'Korea South', name: 'koreasouth' },
      { label: 'South India', name: 'southindia' },
      { label: 'West India', name: 'westindia' },
      { label: 'Canada East', name: 'canadaeast' },
      { label: 'France South', name: 'francesouth' },
      { label: 'Germany North', name: 'germanynorth' },
      { label: 'Norway West', name: 'norwaywest' },
      { label: 'Switzerland West', name: 'switzerlandwest' },
      { label: 'UK West', name: 'ukwest' },
      { label: 'UAE Central', name: 'uaecentral' },
      { label: 'Brazil Southeast', name: 'brazilsoutheast' },
    ],
  },
};
