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

const styles = (theme: CustomTheme) =>
  ({
    contentContainer: {
      marginTop: '1rem',
      maxWidth: 1000,
    },
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
    schemaBuilderStructureViewContent: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 10,
      height: 400,
      'overflow-y': 'scroll',
      marginTop: 15,
      padding: 15,
      border: '1px solid rgba(0, 0, 0, .2)',
    },
    schemaBuilderStructureViewContentTableName: {
      display: 'flex',
      alignItems: 'center',
    },
    schemaBuilderStructureViewContentTableName_text: {
      padding: '0px 6px',
      borderRadius: theme.shape.borderRadius,
      'text-transform': 'none',
      fontWeight: 'bold',
      color: 'black',
      minWidth: 'unset',
    },
    schemaBuilderStructureViewContentTableName_selected: {
      backgroundColor: 'rgba(77, 114, 170, .2)',
      '&:hover': {
        backgroundColor: 'rgba(77, 114, 170, .4)',
      },
    },
    schemaBuilderStructureViewColumnContainer_wrapper: {
      position: 'relative',
    },
    schemaBuilderStructureViewColumnContainer: {
      marginLeft: 20,
      marginTop: -11,
      marginBottom: -10,
      paddingLeft: 20,
      paddingTop: 5,
      borderLeft: '1px dashed #A6B8D4',
    },
    schemaBuilderStructureColumnContainer_expanded: {
      marginBottom: 20,
    },
    schemaBuilderStructureViewContentColumn_dotContainer: {
      position: 'absolute',
      bottom: -1,
      color: '#A6B8D4',
      padding: '0 15px',
      background: 'linear-gradient(0, white 50%, transparent 50%)',
    },
    schemaBuilderStructureViewContentColumn_dot: {
      fontSize: 11,
    },
    schemaBuilderStructureViewContentColumn: {
      display: 'block',
      marginTop: 4,
      fontWeight: 'normal',
    },
    schemaControlButton: {
      'text-transform': 'none',
      padding: '10px 14px 10px 11px',
      marginRight: 15,
    },
    iconInButton: {
      marginRight: 6,
    },
    iconButton: {
      backgroundColor: 'rgba(77, 114, 170, .2)',
      height: '2.6rem',
      width: '2.6rem',
      borderRadius: '100%',
      marginRight: 6,
      fontSize: '1.4rem',
    },
    schemaBuilderDetailView: {
      width: '100%',
      padding: 10,
      marginLeft: 10,
      marginTop: 50,
    },
    formLabel: {
      display: 'block',
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    formLabelError: {
      color: theme.palette.error.main,
    },
    formInput: {
      width: '100%',
      backgroundColor: 'white',
    },
    formInputDatatype: {
      maxWidth: 200,
    },
    jsonWrapper: {
      backgroundColor: '#272822',
      borderRadius: 10,
      padding: 20,
    },
    flexRow: {
      display: 'flex',
    },
  } as any);

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
}

const DatasetSchemaBuilderView = withStyles(styles)(({ classes }: IProps) => {
  const { getValues, setValue } = useFormContext();
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
        // using these regexes to add / remove quotation marks just because the viewer will then color code
        // the keys and values differently. It's easier to read for modifying, but the downside is that
        // it isnt copy-pastable as ready json.
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
          name: 'table_name',
          columns: [],
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
    setDatasetSchema({
      ...datasetSchema,
      tables: datasetSchema.tables.filter((_value, index: number) => index !== selectedTable),
    });
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
      name: 'new_column',
      datatype: 'string',
      array_of: false,
      required: false,
    });
    setDatasetSchema(newSchema);
    setSelectedColumn(newSchema.tables[selectedTable].columns.length - 1);
  };

  const deleteColumn = () => {
    const newSchema = _.cloneDeep(datasetSchema);
    newSchema.tables[selectedTable].columns = newSchema.tables[selectedTable].columns.filter(
      (_value, index: number) => index !== selectedColumn,
    );
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
                  size="small"
                  color="primary"
                  className={classes.iconButton}
                  style={{ marginLeft: 50 }}
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
            <div className={classes.schemaBuilderStructureViewContent}>
              {datasetSchema.tables?.map((table: TableModel, i: number) => (
                <div key={`datasetSchema-table-${i}`}>
                  <div className={classes.schemaBuilderStructureViewContentTableName}>
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
                      {table.name}
                    </Button>
                  </div>

                  {table.columns?.length > 0 && expandedTables[i] && (
                    <div className={classes.schemaBuilderStructureViewColumnContainer_wrapper}>
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
                            {column.name}
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
            <div className={classes.schemaBuilderDetailView}>
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
                  renderInput={(params: any) => <TextField {...params} />}
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

                    if (primaryKeyArr.length > 0) {
                      schemaCopy.tables[selectedTable].primaryKey = primaryKeyArr;
                    } else {
                      delete schemaCopy.tables[selectedTable].primaryKey;
                    }
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
            value={JSON.stringify(datasetSchema, null, 2)}
            height="400px"
            theme={okaidia}
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={onJsonViewerChange}
            className={classes.jsonWrapper}
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
