import React from 'react';
import { Box, FormLabel, Link, styled } from '@mui/material';
import { ManagedGroupMembershipEntry } from 'src/models/group';
import { AppDispatch } from 'src/store';
import { TdrState } from 'src/reducers';
import { useOnMount } from 'src/libs/utils';
import { LaunchOutlined } from '@mui/icons-material';
import { connect } from 'react-redux';
import { getUserGroups } from 'src/actions';
import JadeDropdown from '../dataset/data/JadeDropdown';

const JadeLink = styled('span')(({ theme }) => theme.mixins.jadeLink);

type AuthDomainProps = {
  dispatch: AppDispatch;
  userGroups: Array<ManagedGroupMembershipEntry>;
  setParentAuthDomain: (domain: string) => void;
};

function AuthDomain({ dispatch, userGroups, setParentAuthDomain }: Readonly<AuthDomainProps>) {
  const [selectedAuthDomain, setSelectedAuthDomain] = React.useState<string | undefined>(undefined);

  useOnMount(() => {
    dispatch(getUserGroups());
  });

  return (
    <>
      <FormLabel
        sx={{ fontWeight: 700, color: '#333f52' }}
        htmlFor="select-authorization-domain-select"
      >
        Authorization Domain
        <span style={{ fontWeight: 400, fontStyle: 'italic' }}> - (optional)</span>
      </FormLabel>
      <Box sx={{ mb: 1 }}>
        Authorization Domains restrict data access to only specified individuals in a group and are
        intended to fulfill requirements you may have for data governed by a compliance standard,
        such as federal controlled-access data or HIPAA protected data. They follow all snapshot
        copies and cannot be removed. For more details, see{' '}
        <Link
          href="https://support.terra.bio/hc/en-us/articles/360026775691"
          target="_blank"
          rel="noopener noreferrer"
        >
          <JadeLink>
            When to use an Authorization Domain
            <LaunchOutlined fontSize="small" />
          </JadeLink>
        </Link>
        .
      </Box>
      <JadeDropdown
        sx={{ height: '2.5rem' }}
        disabled={userGroups ? userGroups.length < 1 : true}
        options={userGroups ? userGroups.map((group) => group.groupName) : []}
        name="Select Authorization Domain"
        onSelectedItem={(event) => {
          const authDomain = event.target.value;
          setParentAuthDomain(authDomain);
          setSelectedAuthDomain(authDomain);
        }}
        value={selectedAuthDomain ?? ''}
        includeNoneOption={true}
      />
    </>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    userGroups: state.user.userGroups,
  };
}

export default connect(mapStateToProps)(AuthDomain);
