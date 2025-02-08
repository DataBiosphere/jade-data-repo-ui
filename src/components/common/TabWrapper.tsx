import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HelpContainer from 'components/help/HelpContainer';
import { TdrState } from 'reducers';
import { RouterRootState } from 'connected-react-router';
import { SnapshotAccessRequest } from 'generated/tdr';
import { IRoute } from 'routes/Private';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  // @ts-ignore
  borderBottom: `2px solid ${theme.palette.terra.green}`,
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
  color: '#333F52',
  fontFamily: theme.typography.fontFamily,
  height: '18px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '18px',
  textAlign: 'center',
  width: '100%',
  transition: '0.3s background-color ease-in-out',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    transition: '0.3s background-color ease-in-out',
    backgroundColor: '#ddebd0',
    color: theme.palette.secondary.dark,
    fontWeight: '700 !important',
  },
}));

const StyledHelpContainer = styled(HelpContainer)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.terra.green}`,
  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
  float: 'right',
  width: '20px',
}));

interface ITabConfig {
  label: string;
  path: string;
  hidden?: boolean;
}

type TabWrapperProps = {
  routes: Array<IRoute>;
  snapshotAccessRequests: Array<SnapshotAccessRequest>;
};

function TabWrapper({ routes, snapshotAccessRequests }: TabWrapperProps) {
  const [selectedTab, setSelectedTab] = React.useState<string>('datasets');
  const location = useLocation();

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    setSelectedTab(`/${locationSplit[1] || 'datasets'}`);
  }, [location]);

  const tabConfigs: Array<ITabConfig> = [
    { label: 'Datasets', path: '/datasets' },
    { label: 'Snapshots', path: '/snapshots' },
    { label: 'Activity', path: '/activity', hidden: true },
    { label: 'Ingest Data', path: '/ingestdata' },
    {
      label: 'Requests',
      path: '/requests',
      hidden: snapshotAccessRequests && snapshotAccessRequests.length < 1,
    },
  ];

  const visibleTabs = tabConfigs.filter(
    (config: ITabConfig) =>
      routes.findIndex((route: IRoute) => route.path === config.path) !== -1 && !config.hidden,
  );

  return (
    <Box sx={{ display: 'flex', position: 'relative', zIndex: 2 }}>
      <StyledTabs
        value={visibleTabs.map((tab) => tab.path).includes(selectedTab) ? selectedTab : false}
        TabIndicatorProps={{
          sx: { borderBottom: '8px solid #74ae43' },
        }}
      >
        {visibleTabs.map((config: ITabConfig, i: number) => (
          <StyledTab
            key={`navbar-link-${i}`}
            label={config.label}
            // @ts-ignore
            component={Link}
            value={config.path}
            to={config.path}
            disableFocusRipple
            disableRipple
          />
        ))}
      </StyledTabs>
      <StyledHelpContainer />
    </Box>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    snapshotAccessRequests: state.snapshotAccessRequests?.snapshotAccessRequests,
  };
}

export default connect(mapStateToProps)(TabWrapper);
