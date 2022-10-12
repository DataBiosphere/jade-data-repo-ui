import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { CustomTheme } from '@mui/material/styles';
import { Button, IconButton, Typography } from '@mui/material';
import { SimpleMdeReact } from 'react-simplemde-editor';
import SimpleMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import MarkdownContent from './common/MarkdownContent';
import WithoutStylesMarkdownContent from './common/WithoutStylesMarkdownContent';

const styles = (theme: CustomTheme) =>
  createStyles({
    descriptionEditor: {
      width: '100%',
      display: 'flex',
      alignItems: 'top',
    },
    markdownPreview: {
      width: '100%',
      display: 'flex',
      textAlign: 'left',
    },
    textInputDiv: {
      width: '100%',
      zIndex: '9998',
    },
    descriptionInput: {
      backgroundColor: 'white',
    },
    editIconButton: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.hover,
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
    title: {
      display: 'inline',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: theme.palette.common.white,
    },
  } as const);

const UNSET_DESCRIPTION_TEXT = '(No description added)';

interface DescriptionViewProps extends WithStyles<typeof styles> {
  canEdit: boolean;
  description: string | undefined;
  title: string;
  updateDescriptionFn: any;
}

function DescriptionView({
  canEdit,
  classes,
  description,
  title,
  updateDescriptionFn,
}: DescriptionViewProps) {
  const [hasDescriptionChanged, setHasDescriptionChanged] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingSave, setIsPendingSave] = useState(false);

  useEffect(() => {
    if (isPendingSave && description === descriptionValue) {
      setHasDescriptionChanged(false);
      setIsPendingSave(false);
      setIsEditing(false);
    }
  }, [isPendingSave, description, descriptionValue]);

  const editorOptions = useMemo(
    () =>
      ({
        previewRender(markdownText) {
          return ReactDOMServer.renderToString(
            <WithoutStylesMarkdownContent markdownText={markdownText} />,
          );
        },
        status: false,
      } as SimpleMDE.Options),
    [],
  );

  const onEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onSaveClick = useCallback(() => {
    setIsPendingSave(true);
    updateDescriptionFn(descriptionValue);
  }, [updateDescriptionFn, descriptionValue]);

  const onChange = useCallback(
    (value: string) => {
      if (description !== value) {
        setDescriptionValue(value);
        setHasDescriptionChanged(true);
      } else {
        setHasDescriptionChanged(false);
      }
    },
    [description],
  );

  const onCancel = useCallback(() => {
    setDescriptionValue(description);
    setHasDescriptionChanged(false);
    setIsEditing(false);
  }, [description]);

  return (
    <>
      <div>
        <Typography className={classes.title} variant="h6">
          {`${title}:`}
          {canEdit && (
            <IconButton
              aria-label={`Edit ${title}`}
              className={classes.editIconButton}
              data-cy="description-edit-button"
              disableFocusRipple={true}
              disableRipple={true}
              onClick={onEditClick}
            >
              <i className="fa-solid fa-pen-circle" />
            </IconButton>
          )}
        </Typography>
      </div>
      {!canEdit && (
        <span className={classes.markdownPreview}>
          <MarkdownContent markdownText={descriptionValue} emptyText={UNSET_DESCRIPTION_TEXT} />
        </span>
      )}
      {canEdit && (
        <div className={classes.descriptionEditor}>
          <div className={classes.textInputDiv}>
            {!isEditing && (
              <span className={classes.markdownPreview}>
                <MarkdownContent
                  markdownText={descriptionValue}
                  emptyText={UNSET_DESCRIPTION_TEXT}
                />
              </span>
            )}
            {isEditing && (
              <>
                <SimpleMdeReact
                  onChange={onChange}
                  options={editorOptions}
                  value={descriptionValue}
                />
                <Button
                  aria-label="Save description changes"
                  className={classes.saveDescriptionButton}
                  color="primary"
                  data-cy="description-save-button"
                  disabled={!hasDescriptionChanged}
                  onClick={onSaveClick}
                  type="button"
                  variant="contained"
                >
                  SAVE
                </Button>
                <Button
                  aria-label="Cancel description changes"
                  className={classes.cancelButton}
                  data-cy="description-cancel-button"
                  onClick={onCancel}
                  color="primary"
                  type="button"
                  variant="outlined"
                  disableElevation
                >
                  CANCEL
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default withStyles(styles)(DescriptionView);
