import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';

import Hero from 'media/images/hero.png';
import LightTable from './table/LightTable';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'space-between',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  mainContent: {
    display: 'inline-block',
    color: theme.typography.color,
    overflow: 'hidden',
    padding: theme.spacing(10),
    width: '60%',
  },
  header: {
    fontSize: '28px',
    lineHeight: '36px',
  },
  heroContainer: {
    display: 'inline-block',
  },
  hero: {
    width: '500px',
  },
  warning: {
    fontWeight: '900',
    paddingBottom: theme.spacing(2),
  },
});

export class ServerErrorView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
  };

  render() {
    const { classes, status } = this.props;
    let systemsCount = 0;
    let systemRows = [];
    if (status.apiIsUp) {
      const { systems } = status.serverStatus;
      systemsCount = Object.keys(systems).length;
      systemRows = Object.keys(status.serverStatus.systems).map((member) => ({
        system: member,
        system_is_up: status.serverStatus.systems[member].ok,
      }));
    }
    const columns = [
      {
        label: 'System',
        property: 'system',
      },
      {
        label: 'Status',
        property: 'system_status',
        render: (row) => {
          if (row.system_is_up) {
            return '✅';
          }
          return '❌';
        },
      },
    ];

    const summary = 'Errors';
    return (
      <div className={classes.container}>
        <div className={classes.mainContent}>
          <h1 className={classes.title}>Uh oh, something went wrong!</h1>
          {status.apiIsUp && (
            <div>
              <h2 className={classes.warning}>
                It looks like the Data Repository server is up, but some required services are down.
              </h2>
              <LightTable
                columns={columns}
                rows={systemRows}
                summary={summary}
                totalCount={systemsCount}
              />
            </div>
          )}
          {!status.apiIsUp && (
            <div>
              <h2 className={classes.warning}>The Data Repository server is down!</h2>
              <p>Please check back in later.</p>
            </div>
          )}
        </div>

        <div className={classes.heroContainer}>
          <img src={Hero} alt="hero" className={classes.hero} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.status,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ServerErrorView));
