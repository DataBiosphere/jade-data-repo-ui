import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

import Hero from 'media/images/hero.png';
import LightTable from './table/LightTable';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  fontFamily: theme.typography.fontFamily,
  justifyContent: 'space-between',
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '54px',
  lineHeight: '66px',
  paddingBottom: theme.spacing(8),
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  color: theme.typography.color,
  overflow: 'hidden',
  padding: theme.spacing(10),
  width: '60%',
}));

function ServerErrorView({ status }) {
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

  return (
    <Container>
      <MainContent>
        <Title variant="h1">Uh oh, something went wrong!</Title>
        {status.apiIsUp && (
          <Box>
            <Typography
              variant="h2"
              sx={(theme) => ({
                fontWeight: '900',
                paddingBottom: theme.spacing(2),
              })}
            >
              It looks like the Data Repository server is up, but some required services are down.
            </Typography>
            <LightTable
              columns={columns}
              rows={systemRows}
              totalCount={systemsCount}
              loading={false}
            />
          </Box>
        )}
        {!status.apiIsUp && (
          <Box>
            <Typography
              variant="h2"
              sx={(theme) => ({
                fontWeight: '900',
                paddingBottom: theme.spacing(2),
              })}
            >
              The Data Repository server is down!
            </Typography>
            <Typography>Please check back in later.</Typography>
          </Box>
        )}
      </MainContent>
      <Box sx={{ display: 'inline-block' }}>
        <Box component="img" src={Hero} alt="hero" sx={{ width: '500px' }} />
      </Box>
    </Container>
  );
}

ServerErrorView.propTypes = {
  status: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    status: state.status,
  };
}

export default connect(mapStateToProps)(ServerErrorView);
