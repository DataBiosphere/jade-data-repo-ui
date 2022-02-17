import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { ReactComponent as ExitSVG } from 'media/icons/times-light.svg';
import { ReactComponent as SearchSVG } from 'media/icons/search_icon.svg';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createStyles, CustomTheme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';

const styles = (theme: CustomTheme) =>
  createStyles({
    search: {
      height: 45,
      width: '100%',
      border: `1px solid ${theme.palette.common.border}`,
      backgroundColor: theme.palette.common.selectedTextBackground,
      '&:hover': {
        backgroundColor: fade(theme.palette.common.selection, 0.2),
      },
      position: 'relative',
      borderRadius: '35px',
      marginLeft: 0,
      flex: '2 1 0',
      display: 'flex',
    },
    searchIcon: {
      color: theme.mixins.jadeLink.color,
      paddingLeft: theme.spacing(1.8),
      paddingTop: theme.spacing(1.3),
    },
    searchInput: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(3.7),
    },
    inputRoot: {
      width: '100%',
    },
    clearSearch: {
      paddingRight: '15px',
      height: '60%',
      transform: 'translateY(30%)',
      cursor: 'pointer',
      ...theme.mixins.jadeLink,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  searchString: string;
  onSearchStringChange: any;
  clearSearchString: any;
}

const SearchTable = withStyles(styles)(
  ({ classes, searchString, onSearchStringChange, clearSearchString }: IProps) => {
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchSVG />
        </div>
        <InputBase
          placeholder="Search keyword or description"
          classes={{
            root: classes.inputRoot,
            input: classes.searchInput,
          }}
          onChange={onSearchStringChange}
          value={searchString}
        />
        {searchString.length > 0 && (
          <ExitSVG className={classes.clearSearch} onClick={clearSearchString} />
        )}
      </div>
    );
  },
);

export default SearchTable;
