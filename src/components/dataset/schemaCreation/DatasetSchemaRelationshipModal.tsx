import React, { useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  CustomTheme,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
} from '@mui/material';
import { Close, IndeterminateCheckBoxOutlined, AddBoxOutlined, Circle } from '@mui/icons-material';
import { TableModel, ColumnModel, DatasetSpecificationModel } from 'generated/tdr';

const styles = (theme: CustomTheme) =>
  ({
    iconButton: {
      backgroundColor: 'rgba(77, 114, 170, .2)',
      height: '2.6rem',
      width: '2.6rem',
      borderRadius: '100%',
      marginRight: 6,
      fontSize: '1.4rem',
    },
    dialog: {
      minHeight: '80vh',
      maxHeight: '80vh',
      width: '80%',
      maxWidth: 800,
    },
    dialogHeader: {
      fontSize: '1.5rem',
      lineHeight: 1.5,
      float: 'left',
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flexCol: {
      display: 'flex',
      flexDirection: 'column',
    },
    tableContainer: {
      width: '40%',
      marginTop: 20,
    },
    radioContainer: {
      'overflow-y': 'auto',
      borderRadius: theme.shape.borderRadius,
      border: '1px solid gray',
      height: 350,
      padding: 20,
    },
    radioWrapper: {
      display: 'block',
    },
    formLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    schemaBuilderStructureViewColumnContainer_wrapper: {
      position: 'relative',
    },
    schemaBuilderStructureViewColumnContainer: {
      marginLeft: 20,
      marginTop: -11,
      marginBottom: -10,
      paddingLeft: 20,
      borderLeft: '1px dashed #A6B8D4',
    },
    schemaBuilderStructureColumnContainer_expanded: {
      marginBottom: 20,
    },
    schemaBuilderStructureViewContentColumn_dotContainer: {
      position: 'absolute',
      bottom: -1,
      color: '#A6B8D4',
      padding: '0 15px 7px',
      background: 'linear-gradient(0, white 70%, transparent 30%)',
    },
    schemaBuilderStructureViewContentColumn_dot: {
      fontSize: 11,
    },
    schemaBuilderStructureViewContentColumn: {
      display: 'block',
      marginTop: 4,
      fontWeight: 'normal',
    },
    summaryContainer: {
      margin: 20,
    },
    summaryLabel: {
      fontWeight: 700,
      marginRight: 10,
    },
    summaryDetail: {
      marginRight: 20,
      fontStyle: 'italic',
    },
    actionButtons: {
      marginTop: 20,
    },
    tabButton: {
      'text-transform': 'none',
      marginRight: 15,
    },
  } as any);

type DatasetSchemaRelationshipModalProps = {
  classes: ClassNameMap;
  datasetSchema: DatasetSpecificationModel;
};

interface DatasetTableProps {
  id: string;
  label: string;
  value: string;
  setValue: any;
}

function DatasetSchemaRelationshipModal({
  classes,
  datasetSchema,
}: DatasetSchemaRelationshipModalProps) {
  const [seeMore, setSeeMore] = useState({ open: false });
  const [expandedTables, setExpandedTables] = useState({} as any);
  const [relationshipFrom, setRelationshipFrom] = useState('');
  const [relationshipTo, setRelationshipTo] = useState('');
  const [relationshipName, setRelationshipName] = useState('');

  const handleSeeMoreOpen = () => {
    setSeeMore({ open: true });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({ open: false });
  };

  const wrapRadioValue = (tableName: string, columnName: string) =>
    `${tableName}|column:${columnName}`;

  const unwrapRadioValue = (radioValue: string): { table: string; column: string } => {
    const splitVal = radioValue.split('|column:');
    return {
      table: splitVal[0],
      column: splitVal[1],
    };
  };

  const datasetTable: any = (datasetProps: DatasetTableProps) => {
    const { id, label, value, setValue } = datasetProps;
    return (
      <FormControl className={classes.tableContainer}>
        <FormLabel id={`radiogroup-${id}`} className={classes.formLabel}>
          {label}
        </FormLabel>
        <RadioGroup
          className={classes.radioContainer}
          aria-labelledby={`radiogroup-${id}`}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setValue((event.target as HTMLInputElement).value);
          }}
        >
          {datasetSchema.tables?.map((table: TableModel, i: number) => (
            <div key={`datasetSchema-table-${i}`}>
              <div className={classes.schemaBuilderStructureViewContentTableName}>
                <IconButton
                  color="primary"
                  onClick={() =>
                    setExpandedTables({
                      ...expandedTables,
                      [`${id}-${i}`]: !expandedTables[i],
                    })
                  }
                >
                  {expandedTables[`${id}-${i}`] ? (
                    <IndeterminateCheckBoxOutlined />
                  ) : (
                    <AddBoxOutlined />
                  )}
                </IconButton>
                {table.name}
              </div>

              {table.columns?.length > 0 && expandedTables[`${id}-${i}`] && (
                <div className={classes.schemaBuilderStructureViewColumnContainer_wrapper}>
                  <div className={classes.schemaBuilderStructureViewContentColumn_dotContainer}>
                    <Circle className={classes.schemaBuilderStructureViewContentColumn_dot} />
                  </div>
                  <div
                    className={clsx(classes.schemaBuilderStructureViewColumnContainer, {
                      [classes.schemaBuilderStructureColumnContainer_expanded]:
                        expandedTables[`${id}-${i}`],
                    })}
                  >
                    {table.columns.map((column: ColumnModel, j: number) => (
                      <FormControlLabel
                        key={`table-${table.name}-column-${j}`}
                        className={classes.radioWrapper}
                        control={<Radio />}
                        label={column.name}
                        value={wrapRadioValue(table.name, column.name)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  const relationshipSummary = (radioValue: string) => {
    const unwrappedVal = unwrapRadioValue(radioValue);
    return (
      <div className={classes.flexRow} style={{ justifyContent: 'flex-start' }}>
        <div>
          <span className={classes.summaryLabel}>Table:</span>
          <span className={classes.summaryDetail}>{unwrappedVal.table}</span>
        </div>

        <div className={classes.summaryDetail}>
          <span className={classes.summaryLabel}>Column:</span>
          <span className={classes.summaryDetail}>{unwrappedVal.column}</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <IconButton
        size="small"
        color="primary"
        className={classes.iconButton}
        style={{ marginLeft: 50 }}
        onClick={handleSeeMoreOpen}
      >
        <i className="fa fa-link-horizontal" />
      </IconButton>

      <Paper className={classes.root}>
        <Dialog
          open={seeMore.open}
          scroll="paper"
          fullWidth={true}
          classes={{ paper: classes.dialog }}
          onBackdropClick={handleSeeMoreClose}
        >
          <DialogTitle id="see-more-dialog-title">
            <div className={classes.dialogHeader}>Create a relationship</div>
            <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              className={classes.dialogContentText}
              component="div"
              id="see-more-dialog-content-text"
            >
              Relationships will lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <div className={classes.flexRow}>
                {datasetTable({
                  id: 'radioGroup-relationshipFrom',
                  label: 'Choose a column from a table',
                  value: relationshipFrom,
                  setValue: setRelationshipFrom,
                })}
                <i className="fa fa-circle-arrow-right" style={{ fontSize: '2rem' }} />
                {datasetTable({
                  id: 'radioGroup-relationshipTo',
                  label: 'Add relationship to this column',
                  value: relationshipTo,
                  setValue: setRelationshipTo,
                })}
              </div>
              <div className={classes.summaryContainer}>
                {relationshipSummary(relationshipFrom)}
                <div>Add relationship to:</div>
                {relationshipSummary(relationshipTo)}
              </div>
              <div className={classes.flexCol}>
                <label htmlFor="relationship-name" className={classes.formLabel}>
                  Relationship name
                </label>
                <TextField
                  id="table-name"
                  placeholder="Enter a name"
                  className={classes.formInput}
                  value={relationshipName}
                  onChange={(event: any) => setRelationshipName(event.target.value)}
                />
              </div>
              <div className={classes.actionButtons}>
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  disableElevation
                  className={classes.tabButton}
                  disabled={!relationshipFrom || !relationshipTo || !relationshipName}
                  onClick={() => {
                    handleSeeMoreClose();
                  }}
                >
                  Add relationship
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  disableElevation
                  className={classes.tabButton}
                  onClick={handleSeeMoreClose}
                >
                  Cancel
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(DatasetSchemaRelationshipModal);
