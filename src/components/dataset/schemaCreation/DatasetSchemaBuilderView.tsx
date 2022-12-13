import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WithStyles, withStyles } from '@mui/styles';
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
import { TdrState } from 'reducers';
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
    jsonWrapper: {
      backgroundColor: '#272822',
      borderRadius: 10,
      padding: 20,
    },
  } as any);

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
}

const DatasetSchemaBuilderView = withStyles(styles)(({ classes }: IProps) => {
  const { register, getValues, setValue } = useFormContext();
  const [datasetSchema, setDatasetSchema] = useState(
    getValues().schema as DatasetSpecificationModel,
  );
  const [selectedTable, setSelectedTable] = useState(-1);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [expandedTables, setExpandedTables] = useState({} as any);
  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);
  const [relationshipModalDefaultValues, setRelationshipModalDefaultValues] = useState({
    from: '',
    to: '',
    expandedTables: {},
  });

  const [anchorElDetailsMenu, setAnchorElDetailsMenu] = React.useState<null | HTMLElement>(null);
  const openDetailsMenu = Boolean(anchorElDetailsMenu);

  const columnDatatypeOptions: string[] = _.keys(TableDataType);

  const handleClickDetailsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDetailsMenu(event.currentTarget);
  };
  const handleCloseDetailsMenu = () => setAnchorElDetailsMenu(null);

  const onJsonViewerChange = React.useCallback(
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

  const swapArrayLocs = (arr: Array<any>, index1: number, index2: number) => {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  };

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
                  disabled={selectedTable === -1}
                  className={classes.schemaControlButton}
                  onClick={createColumn}
                >
                  <AddCircleRounded className={classes.iconInButton} />
                  Create a column
                </Button>
              </div>

              <div className={classes.flexRow}>
                <IconButton
                  id="datasetSchema-up"
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  disabled={selectedTable === -1}
                  onClick={() => {
                    const schemaCopy = _.cloneDeep(datasetSchema);
                    if (selectedColumn > 0) {
                      swapArrayLocs(
                        schemaCopy.tables[selectedTable].columns,
                        selectedColumn,
                        selectedColumn - 1,
                      );
                      setSelectedColumn(selectedColumn - 1);
                    } else if (selectedColumn === -1 && selectedTable > 0) {
                      swapArrayLocs(schemaCopy.tables, selectedTable, selectedTable - 1);
                      setSelectedTable(selectedTable - 1);
                    }
                    setDatasetSchema(schemaCopy);
                  }}
                >
                  <i className="fa fa-angle-up" />
                </IconButton>

                <IconButton
                  id="datasetSchema-down"
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  disabled={selectedTable === -1}
                  onClick={() => {
                    const schemaCopy = _.cloneDeep(datasetSchema);
                    if (
                      selectedColumn !== -1 &&
                      selectedColumn < schemaCopy.tables[selectedTable].columns.length - 1
                    ) {
                      swapArrayLocs(
                        schemaCopy.tables[selectedTable].columns,
                        selectedColumn,
                        selectedColumn + 1,
                      );
                      setSelectedColumn(selectedColumn + 1);
                    } else if (
                      selectedTable !== -1 &&
                      selectedTable < schemaCopy.tables.length - 1
                    ) {
                      swapArrayLocs(schemaCopy.tables, selectedTable, selectedTable + 1);
                      setSelectedTable(selectedTable + 1);
                    }
                    setDatasetSchema(schemaCopy);
                  }}
                >
                  <i className="fa fa-angle-down" />
                </IconButton>

                <IconButton
                  id="datasetSchema-linkRel"
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  style={{ marginLeft: 50 }}
                  disabled={!datasetSchema.tables || datasetSchema.tables.length < 2}
                  onClick={() => {
                    setRelationshipModalDefaultValues({
                      from: '',
                      to: '',
                      expandedTables: {},
                    });
                    setRelationshipModalOpen(true);
                  }}
                >
                  <i className="fa fa-link-horizontal" />
                </IconButton>
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
                    <IconButton
                      color="primary"
                      onClick={() =>
                        setExpandedTables({
                          ...expandedTables,
                          [i]: !expandedTables[i],
                        })
                      }
                    >
                      {expandedTables[i] ? <IndeterminateCheckBoxOutlined /> : <AddBoxOutlined />}
                    </IconButton>
                    <Button
                      onClick={() => {
                        if (selectedTable === i && selectedColumn === -1) {
                          setSelectedTable(-1);
                          setSelectedColumn(-1);
                        } else {
                          setSelectedTable(i);
                          setSelectedColumn(-1);
                        }
                      }}
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
                          <Button
                            key={`datasetSchema-table-${i}-column-${j}`}
                            onClick={() => {
                              if (selectedTable === i && selectedColumn === j) {
                                setSelectedTable(-1);
                                setSelectedColumn(-1);
                              } else {
                                setSelectedTable(i);
                                setSelectedColumn(j);
                              }
                            }}
                            className={clsx(
                              classes.schemaBuilderStructureViewContentTableName_text,
                              classes.schemaBuilderStructureViewContentColumn,
                              {
                                [classes.schemaBuilderStructureViewContentTableName_selected]:
                                  selectedTable === i && selectedColumn === j,
                              },
                            )}
                            disableFocusRipple
                            disableRipple
                          >
                            {column.name || '(unnamed column)'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {selectedTable !== -1 && selectedColumn === -1 && (
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
                  MenuListProps={{
                    'aria-labelledby': 'details-menu-button',
                  }}
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
                  onChange={(event: any) => {
                    const schemaCopy = _.cloneDeep(datasetSchema);
                    const newName = event.target.value;
                    const origName = datasetSchema.tables[selectedTable].name;
                    schemaCopy.tables[selectedTable].name = newName;
                    setDatasetSchema(schemaCopy);

                    // Update the name if this table has a relationship
                    if (schemaCopy.relationships) {
                      schemaCopy.relationships = schemaCopy.relationships.map(
                        (rel: RelationshipModel) => {
                          if (rel.from.table === origName) {
                            rel.from.table = newName;
                          }
                          if (rel.to.table === origName) {
                            rel.to.table = newName;
                          }
                          return rel;
                        },
                      );
                    }
                    setDatasetSchema(schemaCopy);
                  }}
                />
              </div>
            </div>
          )}
          {selectedTable !== -1 && selectedColumn !== -1 && (
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
                  MenuListProps={{
                    'aria-labelledby': 'details-menu-button',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setRelationshipModalDefaultValues({
                        from:
                          selectedTable !== -1 && selectedColumn !== -1
                            ? wrapRadioValue(
                                datasetSchema.tables[selectedTable].name,
                                datasetSchema.tables[selectedTable].columns[selectedColumn].name,
                              )
                            : '',
                        expandedTables: {
                          [`radioGroup-relationshipFrom-${selectedTable}`]: true,
                        },
                        to: '',
                      });
                      setRelationshipModalOpen(true);
                    }}
                  >
                    Create relationship
                  </MenuItem>
                  <MenuItem>Remove relationship</MenuItem>
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
                  onChange={(event: any) => {
                    const schemaCopy = _.cloneDeep(datasetSchema);
                    const origName =
                      datasetSchema.tables[selectedTable].columns[selectedColumn].name;
                    const newName = event.target.value;
                    schemaCopy.tables[selectedTable].columns[selectedColumn].name = newName;

                    // Update the primary key name if this is a primary key column.
                    if (schemaCopy.tables[selectedTable].primaryKey) {
                      const primaryKeyArr = _.get(
                        schemaCopy.tables[selectedTable],
                        'primaryKey',
                        [] as string[],
                      );
                      const indexOfPrimaryKey = primaryKeyArr.indexOf(origName);
                      primaryKeyArr[indexOfPrimaryKey] = newName;
                    }

                    // Update the name if this column has a relationship
                    if (schemaCopy.relationships) {
                      schemaCopy.relationships = schemaCopy.relationships.map(
                        (rel: RelationshipModel) => {
                          if (
                            rel.from.table === schemaCopy.tables[selectedTable].name &&
                            rel.from.column === origName
                          ) {
                            rel.from.column = newName;
                          }
                          if (
                            rel.to.table === schemaCopy.tables[selectedTable].name &&
                            rel.to.column === origName
                          ) {
                            rel.to.column = newName;
                          }
                          return rel;
                        },
                      );
                    }
                    setDatasetSchema(schemaCopy);
                  }}
                />
              </div>
              <div>
                <label htmlFor="column-datatype" className={classes.formLabel}>
                  Data type
                </label>
                <Autocomplete
                  id="column-datatype"
                  options={columnDatatypeOptions}
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
                      disabled={
                        datasetSchema.tables[selectedTable].columns[selectedColumn].array_of
                      }
                    />
                  }
                  label="Primary"
                  data-cy="schemaBuilder-column-primary"
                  onChange={(_event: any, change: boolean) => {
                    const schemaCopy = _.cloneDeep(datasetSchema);
                    const columnName =
                      schemaCopy.tables[selectedTable].columns[selectedColumn].name;
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
                        datasetSchema.tables[selectedTable].primaryKey &&
                        (datasetSchema.tables[selectedTable].primaryKey as string[]).indexOf(
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
                        datasetSchema.tables[selectedTable].primaryKey &&
                        (datasetSchema.tables[selectedTable].primaryKey as string[]).indexOf(
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
          )}
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
          defaultRelationshipFrom={relationshipModalDefaultValues.from}
          defaultRelationshipTo={relationshipModalDefaultValues.to}
          defaultExpandedTables={relationshipModalDefaultValues.expandedTables}
          onSubmit={(data: RelationshipModel) => {
            const schemaCopy = _.cloneDeep(datasetSchema);
            if (!schemaCopy.relationships) {
              schemaCopy.relationships = [];
            }
            schemaCopy.relationships.push(data);
            setDatasetSchema(schemaCopy);
            setRelationshipModalOpen(false);
          }}
          onClose={() => {
            setRelationshipModalOpen(false);
          }}
        />
      )}
    </div>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(DatasetSchemaBuilderView);
