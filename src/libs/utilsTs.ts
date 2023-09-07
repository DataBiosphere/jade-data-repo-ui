import _ from 'lodash';
import { CloudPlatform, DatasetModel } from 'generated/tdr';

/**
 * Given an object of parameters, returns a url encoded query string (e.g. what is to the right of the ?)
 * @param params String keyed object with numbers, strings or boolean values
 * @returns A url encoded query string
 */
export const urlEncodeParams = (params: Record<string, string | number | boolean>) =>
  Object.entries(params)
    .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
    .join('&');

/**
 *
 * @param dataset Given a dataset, return the cloud platform it is hosted on
 * @returns The cloud platform or undefined if the dataset has no storage object
 */
export const getCloudPlatform = (dataset: DatasetModel): CloudPlatform | undefined => {
  return _.first(dataset.storage?.map((s) => s.cloudPlatform));
};
