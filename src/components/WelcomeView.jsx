import { JadeLink } from 'components/common/JadeLink';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { LaunchOutlined } from '@mui/icons-material';

import Hero from 'media/images/hero.png';
import LogoGrey from 'media/brand/logo-grey.svg?react';
import LoginButton from './auth/LoginButton';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  fontFamily: theme.typography.fontFamily,
  justifyContent: 'space-between',
  overflow: 'auto',
  background: `url(${Hero})`,
  backgroundPositionX: 'right',
  backgroundPositionY: 'top',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '750px',
  flexGrow: 1,
}));

const Title = styled(Typography)({
  fontSize: '54px',
  lineHeight: '54px',
  paddingBottom: '32px',
  fontWeight: '600',
});

const SubTitle = styled(Typography)({
  fontSize: '16px',
});

const SubTitleBox = styled(Box)({
  fontSize: '16px',
});

const MainContent = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  color: theme.typography.color,
  marginTop: theme.spacing(5),
  padding: theme.spacing(10),
  paddingRight: '650px',
  paddingBottom: '40px',
  width: '100%',
}));

const TerraLink = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(2),
  textDecoration: 'none',
}));

const Header = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
}));

const Footer = styled(Box)(({ theme }) => ({
  height: '60px',
  width: '100%',
  background: 'rgb(109 110 112)',
  color: '#FFFFFF',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const StyledLink = styled('a')({
  height: '40px',
  marginRight: '8px',
});

const StyledLogoGrey = styled(LogoGrey)({
  height: '40px',
  marginRight: '8px',
});

function WelcomeView({ terraUrl }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Container>
        <MainContent>
          <Title>Welcome to Terra Data Repository</Title>
          <SubTitle>
            Terra Data Repository is a cloud-native platform that allows data owners to{' '}
            <b>govern</b> and <b>share</b> biomedical research data.
          </SubTitle>
          <SubTitleBox>
            <a
              href="https://support.terra.bio/hc/en-us/sections/4407099323675-Terra-Data-Repository"
              target="_blank"
              rel="noopener noreferrer"
            >
              <JadeLink
                sx={{
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                Find how-to's, documentation, video tutorials, and discussion forums
                <LaunchOutlined fontSize="small" />
              </JadeLink>
            </a>
          </SubTitleBox>
          <LoginButton />
          <Header>Terra Data Repository requires a Terra account.</Header>
          <p>
            Terra Data Repository uses your Terra account. Once you have signed in and completed the
            user profile registration step, you can start using Terra and Terra Data Repository.
          </p>
          <a href={terraUrl}>
            <TerraLink>Need to create a Terra account?</TerraLink>
          </a>
          <hr />
          <div>
            <Box sx={{ paddingBottom: (theme) => theme.spacing(2) }}>
              <Typography sx={{ fontWeight: '900', paddingBottom: (theme) => theme.spacing(2) }}>
                WARNING NOTICE
              </Typography>
              <div>
                <p>
                  You are accessing a US Government web site which may contain information that must
                  be protected under the US Privacy Act or other sensitive information and is
                  intended Government authorized use only.
                </p>
                <p>
                  Unauthorized attempts to upload information, change information, or use of this
                  web site may result in disciplinary action, civil, and/or criminal penalties.
                  Unauthorized users of this website should have no expectation of privacy regarding
                  any communications or data processed by this website.
                </p>
                <p>
                  Anyone accessing this website expressly consents to monitoring of their actions
                  and all communications or data transiting or stored on related to this website and
                  is advised that if such monitoring reveals possible evidence of criminal activity,
                  NIH may provide that evidence to law enforcement officials.
                </p>
                <p>WARNING NOTICE (when accessing TCGA controlled data)</p>
                <p>
                  You are reminded that when accessing TCGA controlled accessinformation you are
                  bound by the dbGaP TCGA DATA USE CERTIFICATION AGREEMENT (DUCA).
                </p>
              </div>
            </Box>
          </div>
        </MainContent>
      </Container>
      <Footer>
        <StyledLink href={terraUrl} target="_blank" rel="noopener noreferrer">
          <StyledLogoGrey alt="Terra" />
        </StyledLink>
        <a href={`${terraUrl}/#privacy`} target="_blank" rel="noopener noreferrer">
          Privacy Policy
          <LaunchOutlined sx={{ marginLeft: '2px', fontSize: 10 }} />
        </a>
        <Box sx={{ margin: '8px' }}>|</Box>
        <a href={`${terraUrl}/#terms-of-service`} target="_blank" rel="noopener noreferrer">
          Terms of Service
          <LaunchOutlined sx={{ marginLeft: '2px', fontSize: 10 }} />
        </a>
        <Box sx={{ margin: '8px' }}>|</Box>
        <a
          href="https://github.com/DataBiosphere/jade-data-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code
          <LaunchOutlined sx={{ marginLeft: '2px', fontSize: 10 }} />
        </a>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>Copyright ©2024</Typography>
      </Footer>
    </Box>
  );
}

WelcomeView.propTypes = {
  terraUrl: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    terraUrl: state.configuration.configObject.terraUrl,
  };
}

export default connect(mapStateToProps)(WelcomeView);
