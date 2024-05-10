import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import React from 'react';
import { connect } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import { TabClasses } from '@mui/material/Tab/tabClasses';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';
import HelpContainer from 'components/help/HelpContainer';
import history from 'modules/hist';
import { CustomTheme } from '@mui/material/styles';
import { IRoute } from 'routes/Private';
import { TdrState } from 'reducers';
import { RouterRootState } from 'connected-react-router';
import { SnapshotAccessRequest } from 'generated/tdr';

interface ITabConfig {
  label: string;
  path: string;
  hidden?: boolean;
}

const styles = (theme: CustomTheme) =>
  createStyles({
    tabsIndicator: {
      borderBottom: '8px solid #74ae43',
    },
    tabsRoot: {
      borderBottom: `2px solid ${theme.palette.terra.green}`,
      boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
      color: '#333F52',
      fontFamily: theme.typography.fontFamily,
      height: 18,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 18,
      textAlign: 'center',
      width: '100%',
      transition: '0.3s background-color ease-in-out',
    },
    tabSelected: {
      transition: '0.3s background-color ease-in-out',
      backgroundColor: '#ddebd0',
      color: theme.palette.secondary.dark,
      fontWeight: '700 !important',
    },
    tabWrapper: {
      display: 'flex',
      position: 'relative',
      zIndex: 2,
    },
    helpIconDiv: {
      borderBottom: `2px solid ${theme.palette.terra.green}`,
      boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
      float: 'right',
      width: '20px',
    },
  });

type TabWrapperProps = {
  routes: Array<IRoute>;
  classes: ClassNameMap;
  snapshotAccessRequests: Array<SnapshotAccessRequest>;
};

function TabWrapper(props: TabWrapperProps) {
  const { classes, routes, snapshotAccessRequests } = props;

  const locationSplit = history.location.pathname.split('/');
  const selectedTab = `/${locationSplit[1] || 'datasets'}`;

  const tabConfigs: Array<ITabConfig> = [
    { label: 'Datasets', path: '/datasets' },
    { label: 'Snapshots', path: '/snapshots' },
    { label: 'Activity', path: '/activity' },
    { label: 'Ingest Data', path: '/ingestdata' },
    {
      label: 'Requests',
      path: '/snapshot-access-requests',
      hidden: snapshotAccessRequests && snapshotAccessRequests.length < 1,
    },
  ];

  const visibleTabs = tabConfigs.filter(
    (config: ITabConfig) =>
      routes.findIndex((route: IRoute) => route.path === config.path) !== -1 && !config.hidden,
  );

  return (
    <div className={classes.tabWrapper}>
      <Tabs
        value={visibleTabs.map((tab) => tab.path).includes(selectedTab) ? selectedTab : false}
        classes={
          {
            root: classes.tabsRoot,
            indicator: classes.tabsIndicator,
          } as Partial<TabClasses>
        }
      >
        {visibleTabs.map((config: ITabConfig, i: number) => (
          <Tab
            key={`navbar-link-${i}`}
            label={config.label}
            component={Link}
            value={config.path}
            to={config.path}
            classes={{ selected: classes.tabSelected } as Partial<TabClasses>}
            disableFocusRipple
            disableRipple
          />
        ))}
      </Tabs>
      <HelpContainer className={classes.helpIconDiv} />
    </div>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    snapshotAccessRequests: state.snapshotAccessRequests?.snapshotAccessRequests,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(TabWrapper));
