import { CloudPlatform } from 'generated/tdr';

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
  CREATE_DATASET_JOB = 'CREATE_DATASET_JOB',
  CREATE_DATASET_SUCCESS = 'CREATE_DATASET_SUCCESS',
  CREATE_DATASET_FAILURE = 'CREATE_DATASET_FAILURE',
  CREATE_DATASET_EXCEPTION = 'CREATE_DATASET_EXCEPTION',
  REFRESH_DATASETS = 'REFRESH_DATASETS',
  GET_DATASETS = 'GET_DATASETS',
  GET_DATASETS_SUCCESS = 'GET_DATASETS_SUCCESS',
  GET_DATASETS_FAILURE = 'GET_DATASETS_FAILURE',
  GET_DATASET_BY_ID = 'GET_DATASET_BY_ID',
  GET_DATASET_BY_ID_SUCCESS = 'GET_DATASET_BY_ID_SUCCESS',
  GET_DATASET_BY_ID_FAILURE = 'GET_DATASET_BY_ID_FAILURE',
  GET_DATASET_SNAPSHOTS_FAILURE = 'GET_DATASET_SNAPSHOTS_FAILURE',
  GET_DATASET_SNAPSHOTS_SUCCESS = 'GET_DATASET_SNAPSHOTS_SUCCESS',
  GET_DATASET_SNAPSHOTS = 'GET_DATASET_SNAPSHOTS',
  REFRESH_SNAPSHOTS = 'REFRESH_SNAPSHOTS',
  GET_SNAPSHOTS = 'GET_SNAPSHOTS',
  GET_SNAPSHOTS_SUCCESS = 'GET_SNAPSHOTS_SUCCESS',
  GET_SNAPSHOTS_FAILURE = 'GET_SNAPSHOTS_FAILURE',
  GET_SNAPSHOT_BY_ID = 'GET_SNAPSHOT_BY_ID',
  GET_SNAPSHOT_BY_ID_SUCCESS = 'GET_SNAPSHOT_BY_ID_SUCCESS',
  GET_SNAPSHOT_BY_ID_FAILURE = 'GET_SNAPSHOT_BY_ID_FAILURE',
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
  REFRESH_JOBS = 'REFRESH_JOBS',
  GET_JOURNAL_ENTRIES = 'GET_JOURNAL_ENTRIES',
  GET_JOURNAL_ENTRIES_SUCCESS = 'GET_JOURNAL_ENTRIES_SUCCESS',
  GET_JOURNAL_ENTRIES_FAILURE = 'GET_JOURNAL_ENTRIES_FAILURE',
  REFRESH_JOURNAL_ENTRIES = 'REFRESH_JOURNAL_ENTRIES',
  CLEAR_JOB_ID = 'CLEAR_JOB_ID',
  GET_DATASET_TABLE_PREVIEW = 'GET_DATASET_TABLE_PREVIEW',
  GET_DATASET_TABLE_PREVIEW_SUCCESS = 'GET_DATASET_TABLE_PREVIEW_SUCCESS',
  GET_CONFIGURATION_SUCCESS = 'GET_CONFIGURATION_SUCCESS',
  RESET_QUERY = 'RESET_QUERY',
  RESET_COLUMNS = 'RESET_COLUMNS',
  QUERY_MENU_SELECT = 'QUERY_MENU_SELECT',
  APPLY_FILTERS = 'APPLY_FILTERS',
  APPLY_FILTERS_SUCCESS = 'APPLY_FILTERS_SUCCESS',
  PREVIEW_DATA = 'PREVIEW_DATA',
  PREVIEW_DATA_SUCCESS = 'PREVIEW_DATA_SUCCESS',
  PREVIEW_DATA_FAILURE = 'PREVIEW_DATA_FAILURE',
  GET_COLUMN_STATS = 'GET_COLUMN_STATS',
  GET_FILTERED_COLUMN_STATS = 'GET_FILTERED_COLUMN_STATS',
  COLUMN_STATS_TEXT_SUCCESS = 'COLUMN_STATS_TEXT_SUCCESS',
  COLUMN_STATS_FILTERED_TEXT_SUCCESS = 'COLUMN_STATS_FILTERED_TEXT_SUCCESS',
  COLUMN_STATS_ALL_AND_FILTERED_TEXT_SUCCESS = 'COLUMN_STATS_ALL_AND_FILTERED_TEXT_SUCCESS',
  COLUMN_STATS_NUMERIC_SUCCESS = 'COLUMN_STATS_NUMERIC_SUCCESS',
  COLUMN_STATS_FAILURE = 'COLUMN_STATS_FAILURE',
  EXPAND_COLUMN_FILTER = 'EXPAND_COLUMN_FILTER',
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
  PATCH_DATASET_START = 'PATCH_DATASET_START',
  PATCH_DATASET_SUCCESS = 'PATCH_DATASET_SUCCESS',
  PATCH_DATASET_FAILURE = 'PATCH_DATASET_FAILURE',
  PATCH_SNAPSHOT = 'PATCH_SNAPSHOT',
  PATCH_SNAPSHOT_START = 'PATCH_SNAPSHOT_START',
  PATCH_SNAPSHOT_SUCCESS = 'PATCH_SNAPSHOT_SUCCESS',
  PATCH_SNAPSHOT_FAILURE = 'PATCH_SNAPSHOT_FAILURE',
  UPDATE_DUOS_DATASET = 'UPDATE_DUOS_DATASET',
  UPDATE_DUOS_DATASET_START = 'UPDATE_DUOS_DATASET_START',
  UPDATE_DUOS_DATASET_SUCCESS = 'UPDATE_DUOS_DATASET_SUCCESS',
  UPDATE_DUOS_DATASET_FAILURE = 'UPDATE_DUOS_DATASET_FAILURE',
  EXCEPTION = 'EXCEPTION',

  // DUOS
  GET_DUOS_DATASETS = 'GET_DUOS_DATASETS',
  GET_DUOS_DATASETS_SUCCESS = 'GET_DUOS_DATASETS_SUCCESS',
  GET_DUOS_DATASETS_FAILURE = 'GET_DUOS_DATASETS_FAILURE',

  // SNAPSHOT ACCESS REQUESTS
  GET_SNAPSHOT_ACCESS_REQUESTS = 'GET_SNAPSHOT_ACCESS_REQUESTS',
  GET_SNAPSHOT_ACCESS_REQUESTS_SUCCESS = 'GET_SNAPSHOT_ACCESS_REQUESTS_SUCCESS',
  GET_SNAPSHOT_ACCESS_REQUESTS_FAILURE = 'GET_SNAPSHOT_ACCESS_REQUESTS_FAILURE',
  REFRESH_SNAPSHOT_ACCESS_REQUESTS = 'REFRESH_SNAPSHOT_ACCESS_REQUESTS',
  REJECT_SNAPSHOT_ACCESS_REQUEST = 'REJECT_SNAPSHOT_ACCESS_REQUEST',
  REJECT_SNAPSHOT_ACCESS_REQUEST_SUCCESS = 'REJECT_SNAPSHOT_ACCESS_REQUEST_SUCCESS',
  REJECT_SNAPSHOT_ACCESS_REQUEST_FAILURE = 'REJECT_SNAPSHOT_ACCESS_REQUEST_FAILURE',
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

export enum ColumnStatsRetrievalType {
  RETRIEVE_ALL_AND_FILTERED_TEXT = 'RETRIEVE_ALL_AND_FILTERED_TEXT',
  RETRIEVE_FILTERED_TEXT = 'RETRIEVE_FILTERED_TEXT',
  RETRIEVE_ALL_TEXT = 'RETRIEVE_ALL_TEXT',
  RETRIEVE_ALL_NUMERIC = 'RETRIEVE_ALL_NUMERIC',
}

export enum DbColumns {
  ROW_ID = 'datarepo_row_id',
}

export enum ColumnModes {
  NULLABLE = 'NULLABLE',
  REPEATED = 'REPEATED',
  REQUIRED = 'REQUIRED',
}

export enum ColumnDataTypeCategory {
  TEXT = 'TEXT',
  NUMERIC = 'NUMERIC',
}

export enum SnapshotRoles {
  STEWARD = 'steward',
  READER = 'reader',
  DISCOVERER = 'discoverer',
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
  DUOS = 'DUOS',
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

export const DefaultCloudPlatform: CloudPlatform = CloudPlatform.Gcp;

/** Shared Defaults */
export const TABLE_DEFAULT_ROWS_PER_PAGE = 100;
export const TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS = [25, 100, 250];
export const TABLE_DEFAULT_SORT_ORDER = 'asc';
export const TABLE_DEFAULT_COLUMN_WIDTH = 300;

export const CLOUD_PLATFORMS = {
  gcp: {
    key: 'gcp',
    label: 'Google Cloud Platform',
    platform: CloudPlatform.Gcp,
    regions: [
      'asia-east1',
      'asia-east2',
      'asia-northeast1',
      'asia-northeast2',
      'asia-northeast3',
      'asia-south1',
      'asia-southeast1',
      'asia-southeast2',
      'australia-southeast1',
      'europe-central2',
      'europe-north1',
      'europe-west1',
      'europe-west2',
      'europe-west3',
      'europe-west4',
      'europe-west6',
      'northamerica-northeast1',
      'southamerica-east1',
      'us',
      'us-central1',
      'us-east1',
      'us-east4',
      'us-west1',
      'us-west2',
      'us-west3',
      'us-west4',
    ],
  },
  azure: {
    key: 'azure',
    label: 'Microsoft Azure',
    platform: CloudPlatform.Azure,
    regions: [
      'eastus',
      'eastus2',
      'southcentralus',
      'westus2',
      'westus3',
      'australiaeast',
      'southeastasia',
      'northeurope',
      'swedencentral',
      'uksouth',
      'westeurope',
      'centralus',
      'northcentralus',
      'westus',
      'southafricanorth',
      'centralindia',
      'eastasia',
      'japaneast',
      'jioindiawest',
      'koreacentral',
      'canadacentral',
      'francecentral',
      'germanywestcentral',
      'norwayeast',
      'switzerlandnorth',
      'uaenorth',
      'brazilsouth',
      'centralusstage',
      'eastusstage',
      'eastus2stage',
      'northcentralusstage',
      'southcentralusstage',
      'westusstage',
      'westus2stage',
      'asia',
      'asiapacific',
      'australia',
      'brazil',
      'canada',
      'europe',
      'global',
      'india',
      'japan',
      'unitedkingdom',
      'unitedstates',
      'eastasiastage',
      'southeastasiastage',
      'centraluseuap',
      'eastus2euap',
      'westcentralus',
      'southafricawest',
      'australiacentral',
      'australiacentral2',
      'australiasoutheast',
      'japanwest',
      'jioindiacentral',
      'koreasouth',
      'southindia',
      'westindia',
      'canadaeast',
      'francesouth',
      'germanynorth',
      'norwaywest',
      'swedensouth',
      'switzerlandwest',
      'ukwest',
      'uaecentral',
      'brazilsoutheast',
    ],
  },
};
