import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { CustomTheme } from '@mui/material/styles';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { SimpleMdeReact } from 'react-simplemde-editor';
import SimpleMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import MarkdownContent from './common/MarkdownContent';
import WithoutStylesMarkdownContent from './common/WithoutStylesMarkdownContent';

const styles = (theme: CustomTheme) =>
  createStyles({
    editor: {
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
    textInput: {
      width: '100%',
    },
    editIconButton: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.hover,
      },
    },
    saveButton: {
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
  } as const);

const UNSET_FIELD_TEXT = '(Empty)';

interface EditableFieldViewProps extends WithStyles<typeof styles> {
  canEdit: boolean;
  fieldValue: string | undefined;
  fieldName: string;
  updateFieldValueFn: any;
  useMarkdown: boolean;
}

function EditableFieldView({
  canEdit,
  classes,
  fieldValue,
  fieldName,
  updateFieldValueFn,
  useMarkdown,
}: EditableFieldViewProps) {
  const [hasFieldValueChanged, setHasFieldValueChanged] = useState(false);
  const [updatedFieldValue, setUpdatedFieldValue] = useState(fieldValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingSave, setIsPendingSave] = useState(false);

  useEffect(() => {
    if (isPendingSave && fieldValue === updatedFieldValue) {
      setHasFieldValueChanged(false);
      setIsPendingSave(false);
      setIsEditing(false);
    }
  }, [isPendingSave, fieldValue, updatedFieldValue]);

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
    updateFieldValueFn(updatedFieldValue);
  }, [updateFieldValueFn, updatedFieldValue]);

  const onChange = useCallback(
    (value: string) => {
      if (fieldValue !== value) {
        setUpdatedFieldValue(value);
        setHasFieldValueChanged(true);
      } else {
        setHasFieldValueChanged(false);
      }
    },
    [fieldValue],
  );

  const onChangeEvent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [fieldValue],
  );

  const onCancel = useCallback(() => {
    setUpdatedFieldValue(fieldValue);
    setHasFieldValueChanged(false);
    setIsEditing(false);
  }, [fieldValue]);

  return (
    <>
      <div>
        <Typography className={classes.title} variant="h6">
          {`${fieldName}:`}
          {canEdit && (
            <IconButton
              aria-label={`Edit ${fieldName}`}
              className={classes.editIconButton}
              data-cy="editable-field-edit-button"
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
          <MarkdownContent markdownText={updatedFieldValue} emptyText={UNSET_FIELD_TEXT} />
        </span>
      )}
      {canEdit && (
        <div className={classes.editor}>
          <div className={classes.textInputDiv}>
            {!isEditing && (
              <span className={classes.markdownPreview}>
                <MarkdownContent markdownText={updatedFieldValue} emptyText={UNSET_FIELD_TEXT} />
              </span>
            )}
            {isEditing && (
              <>
                {useMarkdown && (
                  <SimpleMdeReact
                    onChange={onChange}
                    options={editorOptions}
                    value={updatedFieldValue}
                  />
                )}
                {!useMarkdown && (
                  <TextField
                    id="outlined-basic"
                    className={classes.textInput}
                    variant="outlined"
                    defaultValue={updatedFieldValue}
                    onChange={onChangeEvent}
                  />
                )}
                <Button
                  aria-label={`Save ${fieldName} changes`}
                  className={classes.saveButton}
                  color="primary"
                  data-cy="editable-field-save-button"
                  disabled={!hasFieldValueChanged}
                  onClick={onSaveClick}
                  type="button"
                  variant="contained"
                >
                  SAVE
                </Button>
                <Button
                  aria-label={`Cancel ${fieldName} changes`}
                  data-cy="editable-field-cancel-button"
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
export default withStyles(styles)(EditableFieldView);
