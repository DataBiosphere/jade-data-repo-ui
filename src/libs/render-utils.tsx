import React from 'react';
import { Typography } from '@mui/material';
import { DatasetSummaryModel, SnapshotSummaryModel } from '../generated/tdr';
import TextContent from 'components/common/TextContent';
import CopyTextButton from 'components/common/CopyTextButton';

const cloudPlatforms = { gcp: 'Google Cloud Platform', azure: 'Microsoft Azure' };
/**
 * Render the cloud platform cell contents of a table
 * @param resource Dataset of Snapshot whose cloud platform to render
 * @returns {JSX.Element}
 */
export const renderCloudPlatforms = (resource: DatasetSummaryModel | SnapshotSummaryModel) => (
  <>
    {Array.from(
      new Set(
        resource.storage?.map((s) =>
          s.cloudPlatform ? cloudPlatforms[s.cloudPlatform] : undefined,
        ),
      ),
    ).map((c, index) => (
      <span key={index.toString()}>{c}</span>
    ))}
  </>
);

/**
 * Render the cloud storage information contents of a table
 * @param resource Dataset of Snapshot whose storage information to render
 * @returns {JSX.Element}
 */
export const renderStorageResources = (resource: DatasetSummaryModel | SnapshotSummaryModel) =>
  resource.storage?.map((storageResource, i) => (
    <Typography data-cy="storage-resource" key={i}>
      {storageResource.cloudResource}: {storageResource.region}
    </Typography>
  ));

/**
 * Render text value in grid, handling the case that the value is null and add copy button
 */
export const renderTextFieldValue = (fieldName: string, fieldValue: string | undefined) => (
  <>
    <Typography variant="h6">{fieldName}:</Typography>
    <TextContent text={fieldValue} />
    {fieldValue && <CopyTextButton valueToCopy={fieldValue} nameOfValue={fieldName} />}
  </>
);
