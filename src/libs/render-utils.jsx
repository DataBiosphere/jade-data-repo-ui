import React from 'react';
import { Typography } from '@mui/material';

const cloudPlatforms = { gcp: 'Google Cloud Platform', azure: 'Microsoft Azure' };
/**
 * Render the cloud platform cell contents of a table
 * @param row
 * @returns {JSX.Element}
 */
export const renderCloudPlatforms = (row) => (
  <div>
    {Array.from(new Set(row.storage.map((s) => cloudPlatforms[s.cloudPlatform]))).map(
      (c, index) => (
        <div key={index.toString()}>{c}</div>
      ),
    )}
  </div>
);

export const renderStorageResources = (dataset) =>
  dataset.storage.map((storageResource, i) => (
    <Typography data-cy="storage-resource" key={i}>
      {storageResource.cloudResource}: {storageResource.region}
    </Typography>
  ));
