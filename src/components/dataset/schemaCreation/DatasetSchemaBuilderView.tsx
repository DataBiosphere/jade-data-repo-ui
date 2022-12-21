import React, { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { withStyles } from '@mui/styles';
import {
  Typography,
  CustomTheme,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Divider,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  AddCircleRounded,
  IndeterminateCheckBoxOutlined,
  AddBoxOutlined,
  MoreVert,
  Circle,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { javascript } from '@codemirror/lang-javascript';
import {
  ColumnModel,
  TableDataType,
  DatasetSpecificationModel,
  TableModel,
  RelationshipModel,
} from 'generated/tdr';
import clsx from 'clsx';
import TerraTooltip from '../../common/TerraTooltip';
import DatasetSchemaRelationshipModal, { wrapRadioValue } from './DatasetSchemaRelationshipModal';
import { styles as DatasetCreationStyles } from './DatasetSchemaCommon';

const styles = (theme: CustomTheme) =>
  ({
    ...DatasetCreationStyles(theme),
    schemaSectionHeader: {
      marginTop: 40,
      paddingBottom: 5,
      borderBottom: `2px solid ${theme.palette.terra.green}`,
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.5rem',
    },
    schemaSectionHeaderDesc: {
      marginLeft: 10,
    },
    section: {
      margin: '20px 0 10px',
    },
    schemaBuilderContainer: {
      backgroundColor: theme.palette.primary.focus,
      padding: 20,
      marginTop: 20,
      borderRadius: theme.shape.borderRadius,
      marginRight: -430,
    },
    schemaBuilderMain: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    schemaBuilderStructureView: {
      width: '55%',
      flexShrink: 0,
    },
    schemaBuilderStructureViewControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    schemaControlButton: {
      'text-transform': 'none',
      padding: '10px 14px 10px 11px',
      marginRight: 15,
    },
    iconInButton: {
      marginRight: 6,
    },
    schemaBuilderDetailView: {
      width: '100%',
      padding: 10,
      marginLeft: 10,
      marginTop: 50,
    },
    formInputDatatype: {
      maxWidth: 200,
    },
    columnNameDisplay: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    columnHighlighted: {
      outline: `1px solid ${theme.palette.primary.main}`,
    },
    relationshipButton: {
      backgroundColor: 'transparent',
      fontSize: '1rem',
      height: '1rem',
      width: '1rem',
      marginTop: 6,
      marginLeft: 6,
    },
    jsonWrapper: {
      // background color to match codemirror okaidia's background color
      backgroundColor: '#272822',
      borderRadius: 10,
      padding: 20,
    },
  } as any);

const defaultRelationship = {
  from: '',
  to: '',
  expandedTables: {},
  name: '',
  isEditMode: false,
};

const defaultUiState = {
  canCreateColumn: false,
  disabledMoveUp: true,
  disabledMoveDown: true,
};

const DatasetSchemaBuilderView = withStyles(styles)(({ classes }: any) => {
  const { register, getValues, setValue } = useFormContext();
  const [datasetSchema, setDatasetSchema] = useState(
    getValues().schema as DatasetSpecificationModel,
  );
  const [selectedTable, setSelectedTable] = useState(-1);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [expandedTables, setExpandedTables] = useState({} as any);
  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);
  const [relationshipModalDefaultValues, setRelationshipModalDefaultValues] = useState(
    defaultRelationship,
  );
  const [outlinedRelationships, setOutlinedRelationships] = useState({} as any);
  const [uiState, setUiState] = useState(defaultUiState);

  const [anchorElDetailsMenu, setAnchorElDetailsMenu] = useState<null | HTMLElement>();
  const openDetailsMenu = Boolean(anchorElDetailsMenu);

  useEffect(() => {
    setUiState({
      canCreateColumn: selectedTable !== -1,
      disabledMoveUp:
        selectedTable === -1 ||
        selectedColumn === 0 ||
        (selectedTable === 0 && selectedColumn === -1),
      disabledMoveDown:
        selectedTable === -1 ||
        (selectedTable === datasetSchema.tables.length - 1 && selectedColumn === -1) ||
        (selectedColumn !== -1 &&
          selectedColumn === datasetSchema.tables[selectedTable].columns.length - 1),
    });
  }, [selectedTable, selectedColumn, datasetSchema.tables]);

  //----------------------------------------
  // Tables
  //----------------------------------------
  const expandTable = (i: number) => {
    setExpandedTables({
      ...expandedTables,
      [i]: !expandedTables[i],
    });
  };

  const selectTable = (i: number) => {
    if (selectedTable === i && selectedColumn === -1) {
      setSelectedTable(-1);
      setSelectedColumn(-1);
    } else {
      setSelectedTable(i);
      setSelectedColumn(-1);
    }
  };

  const createTable = () => {
    if (!datasetSchema.tables) {
      datasetSchema.tables = [];
    }
    const newIndex = datasetSchema.tables.length;
    setDatasetSchema({
      ...datasetSchema,
      tables: [
        ...datasetSchema.tables,
        {
          name: `table_name${datasetSchema.tables.length || ''}`,
          columns: [],
          primaryKey: [],
        },
      ],
    });
    setSelectedTable(newIndex);
    setSelectedColumn(-1);
    setExpandedTables({
      ...expandedTables,
      [newIndex]: true,
    });
  };

  const deleteTable = () => {
    const newSchema = _.cloneDeep(datasetSchema);
    const tableName = newSchema.tables[selectedTable].name;
    newSchema.tables = datasetSchema.tables.filter(
      (_value, index: number) => index !== selectedTable,
    );
    if (newSchema.relationships) {
      newSchema.relationships = newSchema.relationships.filter(
        (relationship: RelationshipModel) =>
          relationship.from.table !== tableName && relationship.to.table !== tableName,
      );
    }
    setDatasetSchema(newSchema);
    handleCloseDetailsMenu();
    setSelectedTable(-1);
    setSelectedColumn(-1);
  };

  const duplicateTable = () => {
    const copyTable = _.cloneDeep(datasetSchema.tables[selectedTable]);
    datasetSchema.tables.splice(selectedTable + 1, 0, copyTable);
    setDatasetSchema({ ...datasetSchema });
    handleCloseDetailsMenu();
  };

  const changeTableName = (event: any) => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    const newName = event.target.value;
    const origName = datasetSchema.tables[selectedTable].name;
    schemaCopy.tables[selectedTable].name = newName;
    setDatasetSchema(schemaCopy);

    // Update the name if this table has a relationship
    if (schemaCopy.relationships) {
      schemaCopy.relationships = schemaCopy.relationships.map((rel: RelationshipModel) => {
        if (rel.from.table === origName) {
          rel.from.table = newName;
        }
        if (rel.to.table === origName) {
          rel.to.table = newName;
        }
        return rel;
      });
    }
    setDatasetSchema(schemaCopy);
  };

  const renderTableDetails = () => {
    return (
      <div className={classes.schemaBuilderDetailView} data-cy="schemaBuilder-detailView">
        <div className={classes.schemaBuilderStructureViewControls}>
          <Typography variant="h4">Table attributes</Typography>
          <IconButton
            id="details-menu-button"
            size="small"
            color="primary"
            className={classes.iconButton}
            onClick={handleClickDetailsMenu}
            aria-controls={openDetailsMenu ? 'details-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openDetailsMenu ? 'true' : undefined}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="details-menu"
            anchorEl={anchorElDetailsMenu}
            open={openDetailsMenu}
            onClose={handleCloseDetailsMenu}
            MenuListProps={{ 'aria-labelledby': 'details-menu-button' }}
          >
            <MenuItem onClick={() => duplicateTable()}>Duplicate table</MenuItem>
            <Divider />
            <MenuItem onClick={() => deleteTable()}>Delete table</MenuItem>
          </Menu>
        </div>
        <div>
          <label htmlFor="table-name" className={classes.formLabel}>
            Table name
          </label>
          <TextField
            id="table-name"
            placeholder="table name"
            className={classes.formInput}
            value={datasetSchema.tables[selectedTable].name}
            onKeyDown={preventFormSubmission}
            onChange={changeTableName}
          />
        </div>
      </div>
    );
  };

  //----------------------------------------
  // Columns
  //----------------------------------------
  const selectColumn = (i: number, j: number) => {
    if (selectedTable === i && selectedColumn === j) {
      setSelectedTable(-1);
      setSelectedColumn(-1);
    } else {
      setSelectedTable(i);
      setSelectedColumn(j);
    }
  };

  const createColumn = () => {
    const newSchema = _.cloneDeep(datasetSchema);
    newSchema.tables[selectedTable].columns.push({
      name: `new_column${newSchema.tables[selectedTable].columns.length || ''}`,
      datatype: 'string',
      array_of: false,
      required: false,
    });
    setDatasetSchema(newSchema);
    setSelectedColumn(newSchema.tables[selectedTable].columns.length - 1);
  };

  const deleteColumn = () => {
    const newSchema = _.cloneDeep(datasetSchema);
    const columnName = newSchema.tables[selectedTable].columns[selectedColumn].name;
    newSchema.tables[selectedTable].columns = newSchema.tables[selectedTable].columns.filter(
      (_value, index: number) => index !== selectedColumn,
    );
    newSchema.tables[selectedTable].primaryKey = newSchema.tables[selectedTable].primaryKey?.filter(
      (value) => value !== columnName,
    );
    if (newSchema.relationships) {
      newSchema.relationships = newSchema.relationships.filter(
        (relationship: RelationshipModel) =>
          relationship.from.column !== columnName && relationship.to.column !== columnName,
      );
    }
    setDatasetSchema(newSchema);
    handleCloseDetailsMenu();
    setSelectedColumn(-1);
  };

  const duplicateColumn = () => {
    const copyColumn = _.cloneDeep(datasetSchema.tables[selectedTable].columns[selectedColumn]);
    datasetSchema.tables[selectedTable].columns.splice(selectedColumn + 1, 0, copyColumn);
    setDatasetSchema({ ...datasetSchema });
    handleCloseDetailsMenu();
  };

  const changeColumnName = (event: any) => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    const origName = datasetSchema.tables[selectedTable].columns[selectedColumn].name;
    const newName = event.target.value;
    schemaCopy.tables[selectedTable].columns[selectedColumn].name = newName;

    // Update the primary key name if this is a primary key column.
    if (schemaCopy.tables[selectedTable].primaryKey) {
      const primaryKeyArr = _.get(schemaCopy.tables[selectedTable], 'primaryKey', [] as string[]);
      const indexOfPrimaryKey = primaryKeyArr.indexOf(origName);
      primaryKeyArr[indexOfPrimaryKey] = newName;
    }

    // Update the name if this column has a relationship
    if (schemaCopy.relationships) {
      schemaCopy.relationships = schemaCopy.relationships.map((rel: RelationshipModel) => {
        if (
          rel.from.table === schemaCopy.tables[selectedTable].name &&
          rel.from.column === origName
        ) {
          rel.from.column = newName;
        }
        if (rel.to.table === schemaCopy.tables[selectedTable].name && rel.to.column === origName) {
          rel.to.column = newName;
        }
        return rel;
      });
    }
    setDatasetSchema(schemaCopy);
  };

  const renderColumnDetails = () => {
    return (
      <div className={classes.schemaBuilderDetailView}>
        <div className={classes.schemaBuilderStructureViewControls}>
          <Typography variant="h4">Column attributes</Typography>
          <IconButton
            id="details-menu-button"
            size="small"
            color="primary"
            className={classes.iconButton}
            onClick={handleClickDetailsMenu}
            aria-controls={openDetailsMenu ? 'details-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openDetailsMenu ? 'true' : undefined}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="details-menu"
            anchorEl={anchorElDetailsMenu}
            open={openDetailsMenu}
            onClose={handleCloseDetailsMenu}
            MenuListProps={{ 'aria-labelledby': 'details-menu-button' }}
          >
            <MenuItem onClick={() => openRelationshipEditor({ useSelectedColumn: true })}>
              Create relationship
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => duplicateColumn()}>Duplicate column</MenuItem>
            <Divider />
            <MenuItem onClick={() => deleteColumn()}>Delete column</MenuItem>
          </Menu>
        </div>
        <div>
          <label htmlFor="column-name" className={classes.formLabel}>
            Column name
          </label>
          <TextField
            id="column-name"
            placeholder="column name"
            className={classes.formInput}
            value={datasetSchema.tables[selectedTable].columns[selectedColumn].name}
            onKeyDown={preventFormSubmission}
            onChange={changeColumnName}
          />
        </div>
        <div>
          <label htmlFor="column-datatype" className={classes.formLabel}>
            Data type
          </label>
          <Autocomplete
            id="column-datatype"
            options={_.keys(TableDataType)}
            className={clsx(classes.formInput, classes.formInputDatatype)}
            renderInput={(params: any) => (
              <TextField {...params} onKeyDown={preventFormSubmission} />
            )}
            value={datasetSchema.tables[selectedTable].columns[selectedColumn].datatype}
            isOptionEqualToValue={(option: string, value: string) =>
              _.get(TableDataType, option) === value
            }
            onChange={(_event: any, change: any) => {
              if (_.has(TableDataType, change)) {
                const schemaCopy = _.cloneDeep(datasetSchema);
                schemaCopy.tables[selectedTable].columns[selectedColumn].datatype = _.get(
                  TableDataType,
                  change,
                  '',
                );
                setDatasetSchema(schemaCopy);
              }
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  datasetSchema.tables[selectedTable].primaryKey &&
                  (datasetSchema.tables[selectedTable].primaryKey as string[]).indexOf(
                    datasetSchema.tables[selectedTable].columns[selectedColumn].name,
                  ) !== -1
                }
                disabled={datasetSchema.tables[selectedTable].columns[selectedColumn].array_of}
              />
            }
            label="Primary"
            data-cy="schemaBuilder-column-primary"
            onChange={(_event: any, change: boolean) => {
              const schemaCopy = _.cloneDeep(datasetSchema);
              const columnName = schemaCopy.tables[selectedTable].columns[selectedColumn].name;
              const primaryKeyArr: string[] = _.get(
                schemaCopy.tables[selectedTable],
                'primaryKey',
                [],
              );
              const primaryKeyIndex: number = primaryKeyArr.indexOf(columnName);
              if (change && primaryKeyIndex === -1) {
                primaryKeyArr.push(columnName);
                schemaCopy.tables[selectedTable].columns[selectedColumn].required = true;
                schemaCopy.tables[selectedTable].columns[selectedColumn].array_of = false;
              } else if (!change && primaryKeyIndex !== -1) {
                primaryKeyArr.splice(primaryKeyIndex, 1);
              }
              schemaCopy.tables[selectedTable].primaryKey = primaryKeyArr;
              setDatasetSchema(schemaCopy);
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={datasetSchema.tables[selectedTable].columns[selectedColumn].required}
                disabled={
                  datasetSchema.tables[selectedTable].columns[selectedColumn].array_of ||
                  datasetSchema.tables[selectedTable].primaryKey?.indexOf(
                    datasetSchema.tables[selectedTable].columns[selectedColumn].name,
                  ) !== -1
                }
              />
            }
            label="Required"
            data-cy="schemaBuilder-column-required"
            onChange={(_event: any, change: boolean) => {
              const schemaCopy = _.cloneDeep(datasetSchema);
              schemaCopy.tables[selectedTable].columns[selectedColumn].required = change;
              setDatasetSchema(schemaCopy);
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={datasetSchema.tables[selectedTable].columns[selectedColumn].array_of}
                disabled={
                  datasetSchema.tables[selectedTable].columns[selectedColumn].required ||
                  datasetSchema.tables[selectedTable].primaryKey?.indexOf(
                    datasetSchema.tables[selectedTable].columns[selectedColumn].name,
                  ) !== -1
                }
              />
            }
            label="Array"
            data-cy="schemaBuilder-column-array"
            onChange={(_event: any, change: boolean) => {
              const schemaCopy = _.cloneDeep(datasetSchema);
              schemaCopy.tables[selectedTable].columns[selectedColumn].array_of = change;
              setDatasetSchema(schemaCopy);
            }}
          />
        </div>
      </div>
    );
  };

  //----------------------------------------
  // Relationships
  //----------------------------------------
  const openRelationshipEditor = (props: {
    rel?: RelationshipModel;
    useSelectedColumn?: boolean;
  }) => {
    const { rel, useSelectedColumn } = props;
    if (rel) {
      const fromIndex = _.findIndex(
        datasetSchema.tables,
        (schemaTable: TableModel) => schemaTable.name === rel.from.table,
      );
      const toIndex = _.findIndex(
        datasetSchema.tables,
        (schemaTable: TableModel) => schemaTable.name === rel.to.table,
      );
      setRelationshipModalDefaultValues({
        from: wrapRadioValue(rel.from.table, rel.from.column),
        to: wrapRadioValue(rel.to.table, rel.to.column),
        expandedTables: {
          [`radioGroup-relationshipFrom-${fromIndex}`]: true,
          [`radioGroup-relationshipTo-${toIndex}`]: true,
        },
        name: rel.name,
        isEditMode: true,
      });
    } else if (useSelectedColumn) {
      const tableName = datasetSchema.tables[selectedTable].name;
      const colName = datasetSchema.tables[selectedTable].columns[selectedColumn].name;
      setRelationshipModalDefaultValues({
        from:
          selectedTable !== -1 && selectedColumn !== -1 ? wrapRadioValue(tableName, colName) : '',
        expandedTables: {
          [`radioGroup-relationshipFrom-${selectedTable}`]: true,
        },
        to: '',
        name: '',
        isEditMode: false,
      });
    } else {
      setRelationshipModalDefaultValues(defaultRelationship);
    }

    setRelationshipModalOpen(true);
    handleCloseDetailsMenu();
  };

  const createRelationship = (data: RelationshipModel) => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    if (!schemaCopy.relationships) {
      schemaCopy.relationships = [];
    }
    schemaCopy.relationships.push(data);
    setDatasetSchema(schemaCopy);
    setRelationshipModalOpen(false);
  };

  const editRelationship = (data: RelationshipModel) => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    if (schemaCopy.relationships) {
      schemaCopy.relationships = schemaCopy.relationships.map((rel: RelationshipModel) => {
        if (rel.name === relationshipModalDefaultValues.name) {
          return data;
        }
        return rel;
      });
    }
    setDatasetSchema(schemaCopy);
    setRelationshipModalOpen(false);
  };

  const deleteRelationship = () => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    schemaCopy.relationships = schemaCopy.relationships?.filter(
      (rel: RelationshipModel) => rel.name !== relationshipModalDefaultValues.name,
    );
    setDatasetSchema(schemaCopy);
    setRelationshipModalOpen(false);
  };

  const highlightRelationshipColumns = (rel: RelationshipModel) => {
    const fromIndices = getIndices(rel.from.table, rel.from.column);
    const toIndices = getIndices(rel.to.table, rel.to.column);
    setOutlinedRelationships({
      [`${fromIndices.table}-${fromIndices.column}`]: true,
      [`${toIndices.table}-${toIndices.column}`]: true,
    });
  };

  //----------------------------------------
  // Table Helper Methods
  //----------------------------------------
  const getIndices = (table: string, column: string) => {
    const tableIndex = _.findIndex(
      datasetSchema.tables,
      (schemaTable: TableModel) => schemaTable.name === table,
    );
    const columnIndex = _.findIndex(
      datasetSchema.tables[tableIndex].columns,
      (schemaCol: ColumnModel) => schemaCol.name === column,
    );
    return {
      table: tableIndex,
      column: columnIndex,
    };
  };

  const swapArrayLocs = (arr: Array<any>, index1: number, index2: number) => {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  };

  const moveSelectedUp = () => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    if (selectedColumn > 0) {
      swapArrayLocs(schemaCopy.tables[selectedTable].columns, selectedColumn, selectedColumn - 1);
      setSelectedColumn(selectedColumn - 1);
    } else if (selectedColumn === -1 && selectedTable > 0) {
      swapArrayLocs(schemaCopy.tables, selectedTable, selectedTable - 1);
      setSelectedTable(selectedTable - 1);
    }
    setDatasetSchema(schemaCopy);
  };

  const moveSelectedDown = () => {
    const schemaCopy = _.cloneDeep(datasetSchema);
    if (
      selectedColumn !== -1 &&
      selectedColumn < schemaCopy.tables[selectedTable].columns.length - 1
    ) {
      swapArrayLocs(schemaCopy.tables[selectedTable].columns, selectedColumn, selectedColumn + 1);
      setSelectedColumn(selectedColumn + 1);
    } else if (selectedTable !== -1 && selectedTable < schemaCopy.tables.length - 1) {
      swapArrayLocs(schemaCopy.tables, selectedTable, selectedTable + 1);
      setSelectedTable(selectedTable + 1);
    }
    setDatasetSchema(schemaCopy);
  };

  //----------------------------------------
  // CodeMirror (JSON viewer)
  //----------------------------------------
  const onJsonViewerChange = useCallback(
    (value: string) => {
      try {
        const potentialSchema = JSON.parse(value);
        setDatasetSchema(potentialSchema);
        setValue('schema', potentialSchema);
      } catch (e) {
        // do nothing
      }
    },
    [setValue],
  );

  //----------------------------------------
  // Form Methods
  //----------------------------------------
  const preventFormSubmission = (event: any) => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };

  const isValidSchema = (tempSchema: any) => {
    if (!tempSchema.tables) {
      return 'Schema must have tables';
    }
    return true;
  };

  register('schema', {
    validate: { isValidSchema },
  });

  //----------------------------------------
  // UI
  //----------------------------------------
  const handleClickDetailsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDetailsMenu(event.currentTarget);
  };
  const handleCloseDetailsMenu = () => setAnchorElDetailsMenu(null);

  //----------------------------------------
  // Final render
  //----------------------------------------
  return (
    <div className={classes.contentContainer}>
      <div>
        <Typography variant="h3">Build a schema</Typography>
        Every dataset in the Terra Data Repo must declare a schema for its tabular data. The schema
        describes what tables will be present in the dataset, and what data categories (i.e., what
        columns) will be present in each column, as well as any relationships between those columns.
      </div>

      <div className={classes.schemaSectionHeader}>
        <Typography variant="h3">Schema for:</Typography>
        <div className={classes.schemaSectionHeaderDesc}>{getValues('name')}</div>
      </div>

      <div className={classes.schemaBuilderContainer}>
        <Typography variant="h4">Schema</Typography>
        <div className={classes.schemaBuilderMain}>
          <div className={classes.schemaBuilderStructureView}>
            <div className={classes.schemaBuilderStructureViewControls}>
              <div>
                <Button
                  id="schemabuilder-createTable"
                  color="primary"
                  disableElevation
                  variant="contained"
                  type="button"
                  className={classes.schemaControlButton}
                  onClick={createTable}
                >
                  <AddCircleRounded className={classes.iconInButton} />
                  Create a table
                </Button>

                <Button
                  id="schemabuilder-createColumn"
                  color="primary"
                  disableElevation
                  variant="contained"
                  type="button"
                  disabled={!uiState.canCreateColumn}
                  className={classes.schemaControlButton}
                  onClick={createColumn}
                >
                  <AddCircleRounded className={classes.iconInButton} />
                  Create a column
                </Button>
              </div>

              <div className={classes.flexRow}>
                <TerraTooltip title="Move up">
                  <span>
                    <IconButton
                      id="datasetSchema-up"
                      size="small"
                      color="primary"
                      className={classes.iconButton}
                      disabled={uiState.disabledMoveUp}
                      onClick={moveSelectedUp}
                    >
                      <i className="fa fa-angle-up" />
                    </IconButton>
                  </span>
                </TerraTooltip>

                <TerraTooltip title="Move down">
                  <span>
                    <IconButton
                      id="datasetSchema-down"
                      size="small"
                      color="primary"
                      className={classes.iconButton}
                      disabled={uiState.disabledMoveDown}
                      onClick={moveSelectedDown}
                    >
                      <i className="fa fa-angle-down" />
                    </IconButton>
                  </span>
                </TerraTooltip>

                <TerraTooltip title="Create relationships">
                  <span>
                    <IconButton
                      id="datasetSchema-linkRel"
                      size="small"
                      color="primary"
                      className={classes.iconButton}
                      style={{ marginLeft: 50 }}
                      disabled={!datasetSchema.tables || datasetSchema.tables.length < 2}
                      onClick={() => openRelationshipEditor({})}
                    >
                      <i className="fa fa-link-horizontal" />
                    </IconButton>
                  </span>
                </TerraTooltip>
              </div>
            </div>
            <div
              className={classes.schemaBuilderStructureViewContent}
              data-cy="schema-builder-structure-view"
            >
              {datasetSchema.tables?.map((table: TableModel, i: number) => (
                <div key={`datasetSchema-table-${i}`}>
                  <div
                    className={classes.schemaBuilderStructureViewContentTableName}
                    data-cy="schemaBuilder-selectTableButton"
                  >
                    <IconButton color="primary" onClick={() => expandTable(i)}>
                      {expandedTables[i] ? <IndeterminateCheckBoxOutlined /> : <AddBoxOutlined />}
                    </IconButton>
                    <Button
                      onClick={() => selectTable(i)}
                      className={clsx(classes.schemaBuilderStructureViewContentTableName_text, {
                        [classes.schemaBuilderStructureViewContentTableName_selected]:
                          selectedTable === i && selectedColumn === -1,
                      })}
                      disableFocusRipple
                      disableRipple
                    >
                      {table.name || '(unnamed table)'}
                    </Button>
                  </div>

                  {table.columns?.length > 0 && expandedTables[i] && (
                    <div
                      className={classes.schemaBuilderStructureViewColumnContainer_wrapper}
                      data-cy="schemaBuilder-tableColumns"
                    >
                      <div className={classes.schemaBuilderStructureViewContentColumn_dotContainer}>
                        <Circle className={classes.schemaBuilderStructureViewContentColumn_dot} />
                      </div>
                      <div
                        className={clsx(classes.schemaBuilderStructureViewColumnContainer, {
                          [classes.schemaBuilderStructureColumnContainer_expanded]:
                            expandedTables[i],
                        })}
                      >
                        {table.columns.map((column: ColumnModel, j: number) => (
                          <div
                            className={classes.columnNameDisplay}
                            key={`datasetSchema-table-${i}-column-${j}`}
                          >
                            <Button
                              onClick={() => selectColumn(i, j)}
                              className={clsx(
                                classes.schemaBuilderStructureViewContentTableName_text,
                                classes.schemaBuilderStructureViewContentColumn,
                                {
                                  [classes.schemaBuilderStructureViewContentTableName_selected]:
                                    selectedTable === i && selectedColumn === j,
                                  [classes.columnHighlighted]: outlinedRelationships[`${i}-${j}`],
                                },
                              )}
                              disableFocusRipple
                              disableRipple
                            >
                              {column.name || '(unnamed column)'}
                            </Button>
                            {datasetSchema.relationships
                              ?.filter((rel: RelationshipModel) => {
                                const isFrom =
                                  rel.from.table === table.name && rel.from.column === column.name;
                                const isTo =
                                  rel.to.table === table.name && rel.to.column === column.name;
                                return isFrom || isTo;
                              })
                              .map((rel: RelationshipModel) => (
                                <TerraTooltip title={rel.name} key={`rel-${rel.name}`}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    className={classes.relationshipButton}
                                    onMouseEnter={() => highlightRelationshipColumns(rel)}
                                    onMouseLeave={() => setOutlinedRelationships({})}
                                    onClick={() => openRelationshipEditor({ rel })}
                                  >
                                    <i className="fa fa-link-horizontal" />
                                  </IconButton>
                                </TerraTooltip>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {selectedTable !== -1 && selectedColumn === -1 && renderTableDetails()}
          {selectedTable !== -1 && selectedColumn !== -1 && renderColumnDetails()}
        </div>

        <div>
          <Typography variant="h4" className={classes.section}>
            JSON view
          </Typography>
          <CodeMirror
            data-cy={JSON.stringify(datasetSchema)}
            value={_.keys(datasetSchema).length > 0 ? JSON.stringify(datasetSchema, null, 2) : ''}
            height="400px"
            theme={okaidia}
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={onJsonViewerChange}
            className={classes.jsonWrapper}
            placeholder="If you already have json, please paste your code here"
          />
        </div>
      </div>

      {relationshipModalOpen && (
        <DatasetSchemaRelationshipModal
          datasetSchema={datasetSchema}
          isEditMode={relationshipModalDefaultValues.isEditMode}
          defaultRelationshipName={relationshipModalDefaultValues.name}
          defaultRelationshipFrom={relationshipModalDefaultValues.from}
          defaultRelationshipTo={relationshipModalDefaultValues.to}
          defaultExpandedTables={relationshipModalDefaultValues.expandedTables}
          onSubmit={(data: RelationshipModel) => {
            if (relationshipModalDefaultValues.isEditMode) {
              editRelationship(data);
            } else {
              createRelationship(data);
            }
          }}
          onClose={() => {
            setRelationshipModalOpen(false);
          }}
          onDelete={deleteRelationship}
        />
      )}
    </div>
  );
});

export default DatasetSchemaBuilderView;
