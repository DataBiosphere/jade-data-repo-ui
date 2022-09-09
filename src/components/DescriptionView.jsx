import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { showNotification } from 'modules/notifications';
import UndoIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import { withStyles } from '@mui/styles';
import { patchDatasetDescription } from 'actions';
import { DatasetRoles } from '../constants';

const styles = (theme) => ({
  root: {
    width: '100%',
    display: 'flex',
  },
  iconDiv: {
    width: '2%',
  },
  textInputDiv: {
    width: '100%',
  },
  descriptionInput: {
    backgroundColor: 'white',
  },
  descriptionButtons: {
    margin: theme.spacing(1),
  },
  editIconButton: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '3px',
    padding: '1px',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  editIconImage: {
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.primary.light,
  },
  undoButton: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.grey[500],
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
});
class DescriptionView extends React.PureComponent {
  constructor(props) {
    super(props);
    const descriptionInitialValue = props.description;
    this.state = {
      hasDescriptionChanged: false,
      descriptionValue: descriptionInitialValue,
      isEditing: false,
      isPendingSave: false,
    };
    this.textFieldRef = React.createRef();
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasetDescription: PropTypes.string,
    description: PropTypes.string,
    updateDescriptionFn: PropTypes.func.isRequired,
    userRoles: PropTypes.array.isRequired,
  };

  componentDidUpdate(prevState) {
    const { description } = this.props;
    const { descriptionValue, isPendingSave } = this.state;
    if (isPendingSave && description === descriptionValue) {
      this.setState({ hasDescriptionChanged: false });
      this.setState({ isPendingSave: false });
      this.onExitEdit();
    }
  }

  descriptionChanged(newDescription, originalDescription) {
    if (newDescription.length > 2047) {
      showNotification({
        response: {
          status: 'Description too long',
          data: {
            message: '',
            errorDetail: 'Exceeds 2047 characters.  Please revise and save again.',
          },
        },
      });
      this.setState({ descriptionValue: newDescription.substring(0, 2046) });
    } else {
      this.setState({ descriptionValue: newDescription });
    }
    if (newDescription !== originalDescription) {
      this.setState({ hasDescriptionChanged: true });
    } else {
      this.setState({ hasDescriptionChanged: false });
    }
  }

  onDescriptionTextBlur(newDescription, originalDescription) {
    this.descriptionChanged(newDescription, originalDescription);
    this.onExitEdit();
  }

  onDescriptionTextClick() {
    const { isEditing } = this.state;
    if (!isEditing) {
      this.setState({ isEditing: true });
    }
  }

  onEditClick() {
    const { isEditing } = this.state;
    if (!isEditing) {
      this.textFieldRef.current.focus();
      this.setState({ isEditing: true });
    }
  }

  onExitEdit() {
    const { description } = this.props;
    const { descriptionValue, isPendingSave } = this.state;
    if (description === descriptionValue) {
      this.setState({ isEditing: false });
    }
  }

  onSaveClick(descriptionText) {
    const { updateDescriptionFn } = this.props;
    this.setState({ isPendingSave: true });
    updateDescriptionFn(descriptionText);
  }

  render() {
    const { classes, description, userRoles, datasetDescription } = this.props;
    const { hasDescriptionChanged, descriptionValue, isEditing } = this.state;
    const canEdit = userRoles.includes(DatasetRoles.STEWARD);
    // const canEdit = false;
    return (
      <>
        {!canEdit && (
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph={true}>
            {description}
          </Typography>
        )}
        {canEdit && (
          <div className={classes.root}>
            <div className={classes.iconDiv}>
              <IconButton
                className={classes.editIconButton}
                aria-label="Edit description"
                onClick={(e) => this.onEditClick()}
                disableFocusRipple={true}
                disableRipple={true}
              >
                <Edit fontStyle="small" className={classes.editIconImage} />
              </IconButton>
            </div>
            <div className={classes.textInputDiv}>
              <TextField
                fullWidth={true}
                inputRef={this.textFieldRef}
                maxLength={2047}
                multiline={true}
                maxRows={5}
                minRows={2}
                onFocus={() => this.onDescriptionTextClick()}
                onClick={() => this.onDescriptionTextClick()}
                onChange={(e) => this.descriptionChanged(e.target.value, description)}
                onBlur={(e) => this.onDescriptionTextBlur(e.target.value, description)}
                placeholder="Add a description."
                type="text"
                value={descriptionValue}
                variant="outlined"
                InputProps={
                  isEditing
                    ? {
                        className: classes.descriptionInput,
                      }
                    : {}
                }
              />
              {isEditing && (
                <>
                  <Button
                    aria-label="Save description changes"
                    className={classes.descriptionButtons}
                    color="primary"
                    disabled={!hasDescriptionChanged}
                    variant="contained"
                    onClick={() => this.onSaveClick(descriptionValue)}
                  >
                    SAVE
                  </Button>
                  <Button
                    aria-label="Undo description changes"
                    className={classes.undoButton}
                    disabled={!hasDescriptionChanged}
                    onClick={() => this.descriptionChanged(description, description)}
                    variant="contained"
                  >
                    UNDO
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
export default withStyles(styles)(DescriptionView);
