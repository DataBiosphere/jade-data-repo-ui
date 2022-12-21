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
import {
  Close,
  IndeterminateCheckBoxOutlined,
  AddBoxOutlined,
  Circle,
  Delete,
} from '@mui/icons-material';
import { TableModel, ColumnModel, DatasetSpecificationModel } from 'generated/tdr';
import TerraTooltip from '../../common/TerraTooltip';
import { styles as DatasetCreationStyles } from './DatasetSchemaCommon';

const styles = (theme: CustomTheme) =>
  ({
    ...DatasetCreationStyles(theme),
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
    tableContainer: {
      width: '40%',
      marginTop: 20,
    },
    tableHeader: {
      marginBottom: 0,
      marginLeft: 2,
    },
    radioWrapper: {
      display: 'block',
    },
    schemaBuilderViewContentChild: {
      width: '100%',
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
    relationshipStructureViewContent: {
      height: 350,
      marginTop: 5,
      flexWrap: 'unset',
    },
    dotContainer: {
      padding: '0 15px 9px',
    },
  } as any);

type DatasetSchemaRelationshipModalProps = {
  classes: ClassNameMap;
  datasetSchema: DatasetSpecificationModel;
  onSubmit: (data: any) => void;
  onClose: () => void;
  onDelete: () => void;
  defaultRelationshipFrom?: string;
  defaultRelationshipTo?: string;
  defaultExpandedTables: { [s: string]: boolean };
  defaultRelationshipName?: string;
  isEditMode?: boolean;
};

interface DatasetTableProps {
  id: string;
  label: string;
  value: string;
  setValue: any;
}

export const wrapRadioValue = (tableName: string, columnName: string) =>
  `${tableName}|column:${columnName}`;

export const unwrapRadioValue = (radioValue: string): { table: string; column: string } => {
  const splitVal = radioValue.split('|column:');
  return {
    table: splitVal[0],
    column: splitVal[1],
  };
};

function DatasetSchemaRelationshipModal({
  classes,
  datasetSchema,
  onSubmit,
  onClose,
  onDelete,
  defaultRelationshipFrom,
  defaultRelationshipTo,
  defaultExpandedTables,
  isEditMode = false,
  defaultRelationshipName,
}: DatasetSchemaRelationshipModalProps) {
  const [expandedTables, setExpandedTables] = useState(defaultExpandedTables || ({} as any));
  const [relationshipFrom, setRelationshipFrom] = useState(defaultRelationshipFrom || '');
  const [relationshipTo, setRelationshipTo] = useState(defaultRelationshipTo || '');
  const [relationshipName, setRelationshipName] = useState(defaultRelationshipName || '');

  const datasetTable: any = (datasetProps: DatasetTableProps) => {
    const { id, label, value, setValue } = datasetProps;
    return (
      <FormControl className={classes.tableContainer}>
        <FormLabel id={`radiogroup-${id}`} className={clsx(classes.formLabel, classes.tableHeader)}>
          {label}
        </FormLabel>
        <RadioGroup
          className={clsx(
            classes.schemaBuilderStructureViewContent,
            classes.relationshipStructureViewContent,
          )}
          aria-labelledby={`radiogroup-${id}`}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setValue((event.target as HTMLInputElement).value);
          }}
        >
          {datasetSchema.tables?.map((table: TableModel, i: number) => (
            <div key={`datasetSchema-table-${i}`} className={classes.schemaBuilderViewContentChild}>
              <div className={classes.schemaBuilderStructureViewContentTableName}>
                <IconButton
                  data-cy="expand-table-button"
                  color="primary"
                  onClick={() =>
                    setExpandedTables({
                      ...expandedTables,
                      [`${id}-${i}`]: !expandedTables[`${id}-${i}`],
                    })
                  }
                >
                  {expandedTables[`${id}-${i}`] ? (
                    <IndeterminateCheckBoxOutlined />
                  ) : (
                    <AddBoxOutlined />
                  )}
                </IconButton>
                {table.name || '(unnamed table)'}
              </div>

              {table.columns?.length > 0 && expandedTables[`${id}-${i}`] && (
                <div className={classes.schemaBuilderStructureViewColumnContainer_wrapper}>
                  <div
                    className={clsx(
                      classes.schemaBuilderStructureViewContentColumn_dotContainer,
                      classes.dotContainer,
                    )}
                  >
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
                        value={wrapRadioValue(table.name, column.name || '(unnamed column)')}
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

  const relationshipSummary = (radioValue: string, label: string) => {
    const unwrappedVal = unwrapRadioValue(radioValue);
    return (
      <div className={classes.flexRow} style={{ justifyContent: 'flex-start' }}>
        <div>
          <span className={classes.summaryLabel}>Table:</span>
          <span id={`${label}-table`} className={classes.summaryDetail}>
            {unwrappedVal.table}
          </span>
        </div>

        <div>
          <span className={classes.summaryLabel}>Column:</span>
          <span id={`${label}-column`} className={classes.summaryDetail}>
            {unwrappedVal.column}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Paper className={classes.root}>
        <Dialog
          open={true}
          scroll="paper"
          fullWidth={true}
          classes={{ paper: classes.dialog }}
          onBackdropClick={onClose}
        >
          <DialogTitle id="see-more-dialog-title">
            <div className={classes.dialogHeader}>
              {isEditMode ? 'Edit relationship' : 'Create a relationship'}
              {isEditMode && (
                <TerraTooltip title="Delete relationship">
                  <span>
                    <IconButton size="small" color="primary" onClick={onDelete}>
                      <Delete />
                    </IconButton>
                  </span>
                </TerraTooltip>
              )}
            </div>
            <IconButton size="small" style={{ float: 'right' }} onClick={onClose}>
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
                {relationshipSummary(relationshipFrom, 'from')}
                <div>Add relationship to:</div>
                {relationshipSummary(relationshipTo, 'to')}
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
                  id="submitButton"
                  type="button"
                  color="primary"
                  variant="contained"
                  disableElevation
                  className={classes.tabButton}
                  disabled={!relationshipFrom || !relationshipTo || !relationshipName}
                  onClick={() => {
                    onSubmit({
                      name: relationshipName,
                      from: unwrapRadioValue(relationshipFrom),
                      to: unwrapRadioValue(relationshipTo),
                    });
                  }}
                >
                  {isEditMode ? 'Update relationship' : 'Create a relationship'}
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  disableElevation
                  className={classes.tabButton}
                  onClick={onClose}
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
