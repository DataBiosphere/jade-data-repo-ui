import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import UserList from '../../../../UserList';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  paperBody: {
    padding: theme.spacing(2),
  },
  headerText: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    marginTop: theme.spacing(3),
  },
  blueLink: {
    color: theme.palette.common.link,
    colorPrimary: theme.palette.common.link,
  },
});

export class DatasetAccess extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    policies: PropTypes.arrayOf(PropTypes.object),
  };

  handleLearnMoreClick = () => {};

  render() {
    const { classes, policies } = this.props;

    const custodiansObj = policies.find((policy) => policy.name === 'custodian');
    const custodians = (custodiansObj && custodiansObj.members) || [];
    const readersObj = policies.find((policy) => policy.name === 'snapshot_creator');
    const readers = (readersObj && readersObj.members) || [];
    const stewardsObj = policies.find((policy) => policy.name === 'steward');
    const stewards = (stewardsObj && stewardsObj.members) || [];

    return (
      <div className={classes.root}>
        <div>
          <Link className={classes.blueLink}>Learn more</Link> about roles and memberships
        </div>
        <UserList users={custodians} typeOfUsers="Stewards" canManageUsers={false} />
        <UserList users={stewards} typeOfUsers="Custodians" canManageUsers={false} />
        <UserList users={readers} typeOfUsers="Readers" canManageUsers={false} />
      </div>
    );
  }
}

export default withStyles(styles)(DatasetAccess);
