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
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
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
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tableContainer: {
      width: '40%',
      height: 350,
      borderRadius: theme.shape.borderRadius,
      border: '1px solid gray',
      padding: 20,
      marginTop: 20,
      'overflow-y': 'auto',
    },
    schemaBuilderStructureViewColumnContainer_wrapper: {
      position: 'relative',
    },
    schemaBuilderStructureViewColumnContainer: {
      marginLeft: 20,
      marginTop: -11,
      marginBottom: -10,
      paddingLeft: 20,
      borderLeft: `1px dashed #A6B8D4`,
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
  } as any);

type DatasetSchemaRelationshipModalProps = {
  classes: ClassNameMap;
  datasetSchema: DatasetSpecificationModel;
};

function DatasetSchemaRelationshipModal({
  classes,
  datasetSchema,
}: DatasetSchemaRelationshipModalProps) {
  const [seeMore, setSeeMore] = useState({ open: false });
  const [expandedTables, setExpandedTables] = useState({} as any);

  const handleSeeMoreOpen = () => {
    setSeeMore({ open: true });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({ open: false });
  };

  const datasetTable: any = (_index: number) => {
    return (
      <div className={classes.tableContainer}>
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
              {table.name}
            </div>

            {table.columns?.length > 0 && expandedTables[i] && (
              <div className={classes.schemaBuilderStructureViewColumnContainer_wrapper}>
                <div className={classes.schemaBuilderStructureViewContentColumn_dotContainer}>
                  <Circle className={classes.schemaBuilderStructureViewContentColumn_dot} />
                </div>
                <div
                  className={clsx(classes.schemaBuilderStructureViewColumnContainer, {
                    [classes.schemaBuilderStructureColumnContainer_expanded]: expandedTables[i],
                  })}
                >
                  {table.columns.map((column: ColumnModel, j: number) => (
                    <Button
                      key={`datasetSchema-table-${i}-column-${j}`}
                      className={clsx(
                        classes.schemaBuilderStructureViewContentTableName_text,
                        classes.schemaBuilderStructureViewContentColumn,
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
            <Typography variant="h3" style={{ float: 'left' }}>
              Create a relationship
            </Typography>
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
                {datasetTable(1)}
                <i className="fa fa-circle-arrow-right" style={{ fontSize: '2rem' }} />
                {datasetTable(2)}
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(DatasetSchemaRelationshipModal);
