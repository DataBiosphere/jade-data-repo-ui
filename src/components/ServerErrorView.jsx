import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

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
  newUser: {
    color: theme.palette.secondary.contrastText,
    fontSize: '18px',
    fontWeight: '300',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
  terraLink: {
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(2),
    textDecoration: 'none',
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
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,
  };

  render() {
    const { classes, status } = this.props;
    let systemsCount = 0;
    let systemRows = [];
    if (status.serverStatus.apiIsUp) {
      const systems = status.serverStatus.systems;
      systemsCount = Object.keys(systems).length;
      systemRows = Object.keys(status.serverStatus.systems).map((member) => {
        return {
          system: member,
          system_is_up: status.serverStatus.systems[member].ok,
        };
      });
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
          <div className={classes.title}>Uh oh, something went wrong!</div>
          {status.apiIsUp && (
            <div>
              <h2>
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
              <h2>The Data Repository Server is down!</h2>
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
