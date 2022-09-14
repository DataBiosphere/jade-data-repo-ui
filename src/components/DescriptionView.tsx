import React from 'react';
import { ClassNameMap, CustomTheme } from '@mui/material/styles';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { showNotification } from 'modules/notifications';
import { withStyles } from '@mui/styles';

const styles = (theme: CustomTheme) => ({
  descriptionEditor: {
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
  editIconButton: {
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '3px',
    boxShadow: 'none',
    padding: '1px',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
      boxShadow: 'none',
    },
  },
  editIconImage: {
    color: theme.palette.primary.light,
    fontSize: theme.typography.h6.fontSize,
  },
  saveDescriptionButton: {
    boxShadow: 'none',
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
      boxShadow: 'none',
    },
  },
  undoButton: {
    backgroundColor: theme.palette.primary.light,
    boxShadow: 'none',
    color: theme.palette.grey[500],
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      boxShadow: 'none',
    },
  },
});

const MAX_LENGTH = 2047;

const descriptionTooLongError = {
  response: {
    status: 'Description too long',
    data: {
      message: '',
      errorDetail: `Exceeds ${MAX_LENGTH} characters.  Please revise and save again.`,
    },
  },
};

type DescriptionViewProps = {
  canEdit: boolean;
  classes: ClassNameMap;
  description: string | undefined;
  updateDescriptionFn: any;
};

type DescriptionViewState = {
  hasDescriptionChanged: boolean;
  descriptionValue: string | undefined;
  isEditing: boolean;
  isPendingSave: boolean;
};

const initialState: DescriptionViewState = {
  hasDescriptionChanged: false,
  descriptionValue: undefined,
  isEditing: false,
  isPendingSave: false,
};

class DescriptionView extends React.PureComponent<DescriptionViewProps, DescriptionViewState> {
  constructor(props: DescriptionViewProps) {
    super(props);
    initialState.descriptionValue = props.description;
    this.state = initialState;
    this.textFieldRef = React.createRef();
  }

  componentDidUpdate() {
    const { descriptionValue, isPendingSave } = this.state;
    const { description } = this.props;
    if (isPendingSave && description === descriptionValue) {
      this.setState({ hasDescriptionChanged: false });
      this.setState({ isPendingSave: false });
      this.onExitEdit();
    }
  }

  textFieldRef: React.RefObject<any>;

  descriptionChanged(newDescription: string | undefined, originalDescription: string | undefined) {
    if (newDescription && newDescription.length > MAX_LENGTH) {
      showNotification(descriptionTooLongError);
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

  onDescriptionTextBlur(
    newDescription: string | undefined,
    originalDescription: string | undefined,
  ) {
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
    const { descriptionValue } = this.state;
    if (description === descriptionValue) {
      this.setState({ isEditing: false });
    }
  }

  onSaveClick(descriptionText: string | undefined) {
    const { updateDescriptionFn } = this.props;
    this.setState({ isPendingSave: true });
    updateDescriptionFn(descriptionText);
  }

  render() {
    const { canEdit, classes, description } = this.props;
    const { hasDescriptionChanged, descriptionValue, isEditing } = this.state;

    return (
      <>
        {!canEdit && (
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph={true}>
            {description}
          </Typography>
        )}
        {canEdit && (
          <div className={classes.descriptionEditor}>
            <div className={classes.iconDiv}>
              <IconButton
                aria-label="Edit description"
                className={classes.editIconButton}
                data-cy="description-edit-button"
                disableFocusRipple={true}
                disableRipple={true}
                onClick={() => this.onEditClick()}
              >
                <Edit fontStyle="small" className={classes.editIconImage} />
              </IconButton>
            </div>
            <div className={classes.textInputDiv}>
              <TextField
                data-cy="description-text-field"
                fullWidth={true}
                inputRef={this.textFieldRef}
                maxRows={5}
                minRows={2}
                multiline={true}
                onBlur={(e) => this.onDescriptionTextBlur(e.target.value, description)}
                onClick={() => this.onDescriptionTextClick()}
                onChange={(e) => this.descriptionChanged(e.target.value, description)}
                onFocus={() => this.onDescriptionTextClick()}
                placeholder="Add a description."
                type="text"
                value={descriptionValue}
                variant="outlined"
                InputProps={isEditing ? { className: classes.descriptionInput } : {}}
              />
              {isEditing && (
                <>
                  <Button
                    aria-label="Save description changes"
                    className={classes.saveDescriptionButton}
                    color="primary"
                    data-cy="description-save-button"
                    disabled={!hasDescriptionChanged}
                    onClick={() => this.onSaveClick(descriptionValue)}
                    type="button"
                    variant="contained"
                  >
                    SAVE
                  </Button>
                  <Button
                    aria-label="Undo description changes"
                    className={classes.undoButton}
                    data-cy="description-undo-button"
                    disabled={!hasDescriptionChanged}
                    onClick={() => this.descriptionChanged(description, description)}
                    type="button"
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
