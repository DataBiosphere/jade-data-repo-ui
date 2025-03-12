import React from 'react';
import InputBase from '@mui/material/InputBase';
import ExitSVG from 'media/icons/times-light.svg?react';
import SearchSVG from 'media/icons/search_icon.svg?react';
import { alpha, Box, Link, styled, useTheme } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }: { theme: CustomTheme }) => ({
  height: '45px',
  width: '100%',
  border: `1px solid ${theme.palette.common.border}`,
  backgroundColor: theme.palette.common.selectedTextBackground,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.selection, 0.2),
  },
  position: 'relative',
  borderRadius: '35px',
  marginLeft: 0,
  flex: '1 1 0',
  display: 'flex',
}));

const ClearSearch = styled(Link)(({ theme }: { theme: CustomTheme }) => ({
  paddingRight: '15px',
  height: '60%',
  transform: 'translateY(30%)',
  cursor: 'pointer',
  ...theme.mixins.jadeLink,
}));

interface IProps {
  searchString: string;
  onSearchStringChange: any;
  clearSearchString: any;
}

function SearchTable({ searchString, onSearchStringChange, clearSearchString }: IProps) {
  const theme = useTheme() as CustomTheme;
  return (
    <SearchContainer theme={theme}>
      <div
        style={{
          color: theme.mixins.jadeLink.color,
          paddingLeft: theme.spacing(1.8),
          paddingTop: theme.spacing(1.3),
        }}
      >
        <SearchSVG />
      </div>
      <InputBase
        placeholder="Search keyword or description"
        sx={{
          paddingLeft: '30px !important',
          width: '100%',
        }}
        onChange={onSearchStringChange}
        value={searchString}
      />
      {searchString.length > 0 && (
        <ClearSearch onClick={clearSearchString} theme={theme}>
          <ExitSVG />
        </ClearSearch>
      )}
    </SearchContainer>
  );
}

export default SearchTable;
