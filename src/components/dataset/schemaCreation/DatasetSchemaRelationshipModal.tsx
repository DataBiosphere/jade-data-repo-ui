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
  FormLabel,
  TextField,
  Button,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { DatasetSpecificationModel } from 'generated/tdr';
import { SchemaTree } from 'components/common/overview/SchemaPanel';
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
      width: '45%',
      marginTop: 20,
    },
    tableHeader: {
      marginBottom: 0,
      marginLeft: 2,
    },
    tableTreeContainer: {
      border: `1px solid ${theme.palette.common.border}`,
      padding: 15,
      borderRadius: 10,
      height: 350,
      overflow: 'auto',
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
  defaultExpandedTablesFrom: number[];
  defaultExpandedTablesTo: number[];
  defaultRelationshipName?: string;
  isEditMode?: boolean;
};

interface DatasetTableProps {
  id: string;
  label: string;
  value: string;
  setValue: any;
  expandedTables: number[];
  setExpandedTables: React.Dispatch<React.SetStateAction<number[]>>;
}

export interface UnwrappedValue {
  table: string;
  column: string;
}

export const wrapRadioValue = (unwrappedValue: UnwrappedValue) =>
  `${unwrappedValue.table}|column:${unwrappedValue.column}`;

export const unwrapRadioValue = (radioValue: string): UnwrappedValue => {
  const splitVal = radioValue.split('|column:');
  return {
    table: splitVal[0],
    column: splitVal[1],
  };
};

const unwrappedValueToIndices = (
  unwrappedValue: UnwrappedValue,
  datasetSchema: DatasetSpecificationModel,
) => {
  const tableIndex = _.findIndex(datasetSchema.tables, (t) => t.name === unwrappedValue.table);
  const columnIndex = _.findIndex(
    datasetSchema.tables[tableIndex]?.columns || [],
    (c) => c.name === unwrappedValue.column,
  );
  return {
    tableIndex,
    columnIndex,
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
  defaultExpandedTablesFrom,
  defaultExpandedTablesTo,
  isEditMode = false,
  defaultRelationshipName,
}: DatasetSchemaRelationshipModalProps) {
  const [expandedTablesFrom, setExpandedTablesFrom] = useState(defaultExpandedTablesFrom);
  const [expandedTablesTo, setExpandedTablesTo] = useState(defaultExpandedTablesTo);
  const [relationshipFrom, setRelationshipFrom] = useState(defaultRelationshipFrom || '');
  const [relationshipTo, setRelationshipTo] = useState(defaultRelationshipTo || '');
  const [relationshipName, setRelationshipName] = useState(defaultRelationshipName || '');

  const datasetTable = (datasetProps: DatasetTableProps) => {
    const { id, label, value, setValue, expandedTables, setExpandedTables } = datasetProps;
    const unwrappedIndices = unwrappedValueToIndices(unwrapRadioValue(value), datasetSchema);
    return (
      <FormControl className={classes.tableContainer}>
        <FormLabel id={`radiogroup-${id}`} className={clsx(classes.formLabel, classes.tableHeader)}>
          {label}
        </FormLabel>
        <div className={classes.tableTreeContainer}>
          <SchemaTree
            tables={datasetSchema.tables || []}
            readOnly={false}
            expanded={expandedTables.map((t) => `${t}`)}
            onNodeToggle={(_e, nodeIds) => setExpandedTables(nodeIds.map((n) => Number(n)))}
            selected={`${unwrappedIndices.tableIndex}-${unwrappedIndices.columnIndex}`}
            selectedColumnnsAsRadio
            onNodeSelect={(_e, nodeId) => {
              const indexes = nodeId.split('-').map((i) => Number(i));
              if (indexes.length === 2) {
                setValue(
                  wrapRadioValue({
                    table: datasetSchema.tables[indexes[0]].name,
                    column: datasetSchema.tables[indexes[0]].columns[indexes[1]].name,
                  }),
                );
              }
            }}
          />
        </div>
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
                  expandedTables: expandedTablesFrom,
                  setExpandedTables: setExpandedTablesFrom,
                })}
                <i className="fa fa-circle-arrow-right" style={{ fontSize: '2rem' }} />
                {datasetTable({
                  id: 'radioGroup-relationshipTo',
                  label: 'Add relationship to this column',
                  value: relationshipTo,
                  setValue: setRelationshipTo,
                  expandedTables: expandedTablesTo,
                  setExpandedTables: setExpandedTablesTo,
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
