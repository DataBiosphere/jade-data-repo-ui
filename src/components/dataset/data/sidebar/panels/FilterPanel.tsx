import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { WithStyles, withStyles, ClassNameMap, createStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material/styles';
import { FilterMap, FilterType } from '../filter/FilterTypes';
import { DatasetModel, TableModel, ColumnModel } from 'generated/tdr';
import {
  Autocomplete,
  Box,
  Typography,
  Button,
  Grid,
  ListItem,
  Collapse,
  Divider,
  TextField,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import TerraTooltip from 'components/common/TerraTooltip';
import FilterPanelItem from '../filter/FilterPanelItem';
import DataSidebarPanel from '../DataSidebarPanel';
import { TdrState } from '../../../../../reducers';
import { applyFilters } from '../../../../../actions';
import { AppDispatch } from '../../../../../store';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
    hide: {
      display: 'none',
    },
    filterPanel: {
      marginBottom: '8px',
    },
    sidebarTitle: {
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
    },
    snapshotBtnCntnr: {
      textAlign: 'end',
    },
    panelContent: {
      padding: `0px ${theme.spacing(2)}`,
    },
    rowOne: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    rowTwo: {},
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
    },
    inputBase: {
      width: '100%',
    },
    filterListItem: {
      justifyContent: 'space-between',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    highlighted: {
      backgroundColor: theme.palette.primary.focus,
      borderRadius: theme.shape.borderRadius,
      paddingBottom: theme.spacing(0.5),
    },
    tooltip: {
      pointerEvents: 'auto !important' as any, // TS doesn't recognize !important as PointerEvent type
      color: 'red',
    },
    button: {
      marginTop: theme.spacing(1),
    },
  });

interface FilterPanelProps extends WithStyles<typeof styles> {
  canLink: boolean;
  classes: ClassNameMap;
  dataset: DatasetModel;
  dispatch: AppDispatch;
  filterData: any;
  filterStatement: string;
  handleCreateSnapshot: (isSavingSnapshot: boolean) => void;
  joinStatement: string;
  open: boolean;
  selected: string;
  table: TableModel;
  token: string;
}

function FilterPanel({
  canLink,
  classes,
  dataset,
  dispatch,
  filterData,
  filterStatement,
  handleCreateSnapshot,
  joinStatement,
  open,
  selected,
  table,
  token,
}: FilterPanelProps) {
  const [filterMap, setFilterMap] = useState<FilterMap>({});
  const [searchInput, setSearchInput] = useState('');
  const [searchStrings, setSearchStrings] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState('');

  useEffect(() => {
    setFilterMap(filterData);
  }, [filterMap, filterData]);

  const handleChange = (column: string, filter: FilterType, tableName: string) => {
    const clonedMap: FilterMap = _.cloneDeep(filterMap);
    if (filter.value == null || filter.value.length === 0) {
      delete clonedMap[tableName][column];
      if (_.isEmpty(clonedMap[tableName])) {
        delete clonedMap[tableName];
      }
    } else if (_.isPlainObject(clonedMap[tableName])) {
      clonedMap[tableName][column] = {
        exclude: filter.exclude,
        value: filter.value,
        type: filter.type,
      };
    } else {
      clonedMap[tableName] = {
        [column]: {
          exclude: filter.exclude,
          value: filter.value,
          type: filter.type,
        },
      };
    }
    setFilterMap(clonedMap);
    dispatch(applyFilters(clonedMap, tableName, dataset));
  };

  const onPaste = (event: any) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s: any) => s !== '');
    const updatedValueArray = searchStrings.concat(nonEmpty);
    setSearchStrings(updatedValueArray);
  };

  const handleSearchString = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleReturn = (event: any) => {
    if (event.key === 'Enter' && searchInput) {
      setSearchInput('');
      setSearchStrings([...searchStrings, searchInput]);
    }
  };

  const handleSearchFilter = (_event: any, value: any) => {
    setSearchStrings(value);
    setSearchInput('');
  };

  const handleOpenFilter = (filter: any) => {
    if (filter.name === openFilter) {
      setOpenFilter('');
    } else {
      setOpenFilter(filter.name);
    }
  };

  const filteredColumns = table.columns
    .filter((column: ColumnModel) => {
      const stringsToCheck = [...searchStrings, searchInput]
        .filter((str) => !!str)
        .map((searchStr) => column.name.includes(searchStr))
        .filter((hasMatch) => hasMatch);
      return stringsToCheck.length > 0 || (searchStrings.length === 0 && !searchInput);
    })
    .map((column) => ({
      datatype: column.datatype,
      array_of: column.array_of,
      name: column.name,
    }));

  const billingErrorMessage =
    "You cannot create a snapshot because you do not have access to the dataset's billing profile.";

  return (
    <div className={classes.root}>
      <div className={classes.rowOne}>
        <Box className={!open ? classes.hide : ''}>
          <Grid container={true} spacing={1}>
            <Grid item xs={10} className={classes.sidebarTitle}>
              <Typography variant="h6" display="block">
                Select Data
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <div className={clsx(classes.filterPanel, { [classes.hide]: !open })}>
          <DataSidebarPanel selected={selected} data-cy="snapshotCard" />
        </div>
        <Autocomplete
          className={classes.inputBase}
          multiple
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              className={classes.input}
              placeholder="Search filters"
              onChange={handleSearchString}
              onKeyDown={handleReturn}
              onPaste={onPaste}
              data-cy="enterEmailBox"
            />
          )}
          onChange={handleSearchFilter}
          value={searchStrings}
          inputValue={searchInput}
          options={[]}
        />
        {table &&
          table.name &&
          filteredColumns.map((c: any) => (
            <div
              className={clsx({ [classes.highlighted]: c.name === openFilter })}
              data-cy="filterItem"
              key={c.name}
            >
              <ListItem
                button
                className={classes.filterListItem}
                onClick={() => handleOpenFilter(c)}
              >
                {c.name}
                {c.name === openFilter ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={c.name === openFilter} timeout="auto" className={classes.panelContent}>
                <FilterPanelItem
                  column={c}
                  dataset={dataset}
                  filterData={filterData}
                  filterStatement={filterStatement}
                  joinStatement={joinStatement}
                  handleFilterChange={handleChange}
                  // handleFilters={handleFilters}
                  tableName={table.name}
                  token={token}
                />
              </Collapse>
            </div>
          ))}
      </div>
      <div className={clsx(classes.rowTwo, classes.snapshotBtnCntnr)}>
        <Divider />
        <TerraTooltip title={canLink ? '' : billingErrorMessage}>
          <span>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              disabled={_.isEmpty(dataset?.schema?.assets) || !canLink}
              className={clsx(
                {
                  [classes.hide]: !open,
                  [classes.tooltip]: _.isEmpty(dataset?.schema?.assets),
                },
                classes.button,
              )}
              onClick={() => handleCreateSnapshot(true)}
              data-cy="createSnapshot"
            >
              Next
            </Button>
          </span>
        </TerraTooltip>
      </div>
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    dataset: state.datasets.dataset,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    joinStatement: state.query.joinStatement,
    token: state.user.delegateToken,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(FilterPanel));
