import React from 'react';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { CustomTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { DatasetSummaryModel, SnapshotSummaryModel } from 'generated/tdr';
import _ from 'lodash';
import TerraTooltip from 'components/common/TerraTooltip';

import { ResourceType } from '../../constants';

const styles = (theme: CustomTheme) =>
  createStyles({
    nameWrapper: {
      display: 'flex',
    },
    // eslint-disable-next-line prefer-object-spread
    jadeLinkWrapper: Object.assign({ flexGrow: 1 }, theme.mixins.ellipsis),
    jadeLink: {
      ...theme.mixins.jadeLink,
    },
    addAsSteward: {
      padding: 0,
      '& svg': {
        height: 20,
        fill: theme.palette.primary.main,
      },
    },
  });

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

interface IProps extends WithStyles<typeof styles> {
  resourceType: ResourceType;
  resource: DatasetSummaryModel | SnapshotSummaryModel;
  roleMaps: { [key: string]: Array<string> };
  handleMakeSteward?: (datasetId: string) => void;
}

const ResourceName = withStyles(styles)(
  ({ classes, resourceType, resource, roleMaps, handleMakeSteward }: IProps) => (
    <div className={classes.nameWrapper} data-cy={`resource-name-${resource.id}`}>
      <Link to={getLink(resource.id || '', resourceType)} className={classes.jadeLinkWrapper}>
        <span className={classes.jadeLink}>{resource.name}</span>
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
          <IconButton
            className={classes.addAsSteward}
            size="small"
            onClick={() => {
              resource.id && handleMakeSteward && handleMakeSteward(resource.id || '');
            }}
          >
            <PersonAdd />
          </IconButton>
        </TerraTooltip>
      )}
    </div>
  ),
);

export default ResourceName;
