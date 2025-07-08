import { styled } from '@mui/material/styles';
import React from 'react';
import { Divider } from '@mui/material';

const JadeTitle = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '54px',
  lineHeight: '66px',
  padding: theme.spacing(4),
}));

const JadeSection = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
  margin: `${theme.spacing(1)} 0px`,
}));

class DataExplorerView extends React.PureComponent {
  render() {
    return (
      <div>
        <JadeTitle>Data Explorer</JadeTitle>
        <JadeSection>This is where the filter options will go</JadeSection>
        <Divider />
        <JadeSection>This is where the applied filters will go</JadeSection>
        <Divider />
        <JadeSection>This is where the dataset results will go</JadeSection>
      </div>
    );
  }
}
export default DataExplorerView;
