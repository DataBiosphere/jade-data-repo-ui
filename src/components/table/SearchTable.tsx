import React from 'react';
import InputBase from '@mui/material/InputBase';
import ExitSVG from 'media/icons/times-light.svg?react';
import SearchSVG from 'media/icons/search_icon.svg?react';
import { alpha, Box, Link, styled } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => {
  const customTheme = theme as CustomTheme;
  return {
    height: '45px',
    width: '100%',
    border: `1px solid ${customTheme.palette.common.border}`,
    backgroundColor: customTheme.palette.common.selectedTextBackground,
    '&:hover': {
      backgroundColor: alpha(customTheme.palette.common.selection, 0.2),
    },
    position: 'relative',
    borderRadius: '35px',
    marginLeft: 0,
    flex: '1 1 0',
    display: 'flex',
  };
});

const ClearSearch = styled(Link)(({ theme }) => ({
  paddingRight: '15px',
  height: '60%',
  transform: 'translateY(30%)',
  cursor: 'pointer',
  ...(theme as CustomTheme).mixins.jadeLink,
}));

interface IProps {
  readonly searchString: string;
  readonly onSearchStringChange: any;
  readonly clearSearchString: any;
}

function SearchTable({ searchString, onSearchStringChange, clearSearchString }: IProps) {
  return (
    <SearchContainer>
      <Box
        sx={{
          color: (theme) => (theme as CustomTheme).mixins.jadeLink.color,
          paddingLeft: (theme) => theme.spacing(1.8),
          paddingTop: (theme) => theme.spacing(1.3),
        }}
      >
        <SearchSVG />
      </Box>
      <InputBase
        placeholder="Search keyword or description"
        sx={{
          paddingLeft: (theme) => `${theme.spacing(3.7)} !important`,
          width: '100%',
        }}
        onChange={onSearchStringChange}
        value={searchString}
      />
      {searchString.length > 0 && (
        <ClearSearch onClick={clearSearchString}>
          <ExitSVG />
        </ClearSearch>
      )}
    </SearchContainer>
  );
}

export default SearchTable;
