import React from 'react';
import { ClassNameMap, CustomTheme } from '@mui/material/styles';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { Circle, Edit } from '@mui/icons-material';
import { showNotification } from 'modules/notifications';
import { withStyles } from '@mui/styles';
import { DatasetRoles } from '../constants';

const styles = (theme: CustomTheme) =>
  ({
    descriptionEditor: {
      width: '100%',
      display: 'flex',
    },
    textInputDiv: {
      width: '100%',
    },
    descriptionInput: {
      backgroundColor: 'white',
    },
    editIconButton: {
      boxShadow: 'none',
      position: 'relative',
      zIndex: 1,
      '&:hover': {
        boxShadow: 'none',
      },
    },
    editIconImage: {
      color: theme.palette.primary.light,
      fontSize: theme.typography.h6.fontSize,
      zIndex: 2,
    },
    iconButtonBackground: {
      color: theme.palette.primary.main,
      fontSize: theme.typography.h2.fontSize,
      position: 'absolute',
      '&:hover': {
        color: theme.palette.primary.hover,
        boxShadow: 'none',
      },
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
  } as const);

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
  classes: ClassNameMap;
  description: string;
  updateDescriptionFn: any;
  userRoles: Array<string>;
};

type DescriptionViewState = {
  hasDescriptionChanged: boolean;
  descriptionValue: string | null;
  isEditing: boolean;
  isPendingSave: boolean;
};

const initialState: DescriptionViewState = {
  hasDescriptionChanged: false,
  descriptionValue: null,
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

  descriptionChanged(newDescription: string | null, originalDescription: string | null) {
    if (newDescription && newDescription.length > MAX_LENGTH) {
      showNotification(descriptionTooLongError);
      this.setState({ descriptionValue: newDescription.substring(0, MAX_LENGTH - 1) });
    } else {
      this.setState({ descriptionValue: newDescription });
    }
    if (newDescription !== originalDescription) {
      this.setState({ hasDescriptionChanged: true });
    } else {
      this.setState({ hasDescriptionChanged: false });
    }
  }

  onDescriptionTextBlur(newDescription: string | null, originalDescription: string | null) {
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

  onSaveClick(descriptionText: string | null) {
    const { updateDescriptionFn } = this.props;
    this.setState({ isPendingSave: true });
    updateDescriptionFn(descriptionText);
  }

  render() {
    const { classes, description, userRoles } = this.props;
    const { hasDescriptionChanged, descriptionValue, isEditing } = this.state;
    const canEdit = userRoles.includes(DatasetRoles.STEWARD);

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
                <Circle fontStyle="large" className={classes.iconButtonBackground} />
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
