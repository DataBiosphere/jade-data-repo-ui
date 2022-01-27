import React from 'react';

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
