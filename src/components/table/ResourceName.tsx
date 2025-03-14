import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Box, useTheme } from '@mui/material';
import { CustomTheme, styled } from '@mui/material/styles';
import { PersonAdd } from '@mui/icons-material';
import { DatasetSummaryModel, SnapshotSummaryModel } from 'generated/tdr';
import _ from 'lodash';
import TerraTooltip from 'components/common/TerraTooltip';

import { ResourceType } from '../../constants';
import {JadeLinkInline} from "components/common/JadeLink";

const AddAsStewardButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  '& svg': {
    height: '20px',
    fill: theme.palette.primary.main,
  },
}));

function hasAdminOnlyAccess(id: string, roleMaps: { [key: string]: Array<string> }) {
  const roles = roleMaps[id];
  return _.isArray(roles) && roles.length === 1 && roles[0] === 'admin';
}

function getLink(id: string, resourceType: ResourceType) {
  switch (resourceType) {
    case ResourceType.DATASET:
      return `/datasets/${id}`;
    case ResourceType.SNAPSHOT:
      return `/snapshots/${id}`;
    default:
      throw new Error('Invalid resource type');
  }
}

interface IProps {
  readonly resourceType: ResourceType;
  readonly resource: DatasetSummaryModel | SnapshotSummaryModel;
  readonly roleMaps: { [key: string]: Array<string> };
  readonly handleMakeSteward?: (datasetId: string) => void;
}

function ResourceName({ resourceType, resource, roleMaps, handleMakeSteward }: IProps) {
  const theme = useTheme() as CustomTheme;
  return (
    <Box sx={{ display: 'flex' }} data-cy={`resource-name-${resource.id}`}>
      <Link
        style={{
          flexGrow: 1,
          ...theme.mixins.ellipsis,
        }}
        to={getLink(resource.id || '', resourceType)}
      >
        <JadeLinkInline>{resource.name}</JadeLinkInline>
      </Link>
      {hasAdminOnlyAccess(resource.id || '', roleMaps) && (
        <TerraTooltip
          data-cy="add-self-as-steward"
          title={
            <span>
              <b>Admin only:</b> Add yourself as a steward to this {resourceType}
            </span>
          }
        >
          <AddAsStewardButton
            size="small"
            onClick={() => {
              resource.id && handleMakeSteward && handleMakeSteward(resource.id || '');
            }}
          >
            <PersonAdd />
          </AddAsStewardButton>
        </TerraTooltip>
      )}
    </Box>
  );
}

export default ResourceName;
