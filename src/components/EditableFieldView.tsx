import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { CustomTheme } from '@mui/material/styles';
import { Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import { SimpleMdeReact } from 'react-simplemde-editor';
import SimpleMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import TextContent from './common/TextContent';
import WithoutStylesMarkdownContent from './common/WithoutStylesMarkdownContent';
import InfoHoverButton from './common/InfoHoverButton';

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
  isPendingSave: boolean;
  fieldValue: string | undefined;
  fieldName: string;
  infoButtonText?: string;
  updateFieldValueFn: any;
  useMarkdown: boolean;
}

function EditableFieldView({
  canEdit,
  isPendingSave,
  classes,
  fieldValue,
  fieldName,
  infoButtonText,
  updateFieldValueFn,
  useMarkdown,
}: EditableFieldViewProps) {
  const [hasFieldValueChanged, setHasFieldValueChanged] = useState(false);
  const [updatedFieldValue, setUpdatedFieldValue] = useState(fieldValue);
  const [isEditing, setIsEditing] = useState(false);

  const cypressFieldNameFormatted = fieldName.replace(' ', '-').toLowerCase();

  useEffect(() => {
    const fieldUpdated = fieldValue === updatedFieldValue;
    const fieldUnset = !(fieldValue || updatedFieldValue);
    if (fieldUpdated || fieldUnset) {
      setHasFieldValueChanged(false);
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
    [onChange],
  );

  const onCancel = useCallback(() => {
    setUpdatedFieldValue(fieldValue);
    setHasFieldValueChanged(false);
    setIsEditing(false);
  }, [fieldValue]);

  return (
    <div data-cy={`${cypressFieldNameFormatted}-editable-field-view`}>
      <div>
        <Typography
          className={classes.title}
          data-cy={`${cypressFieldNameFormatted}-field-name`}
          variant="h6"
        >
          {`${fieldName}:`}
          {canEdit && (
            <IconButton
              aria-label={`Edit ${fieldName}`}
              className={classes.editIconButton}
              data-cy={`${cypressFieldNameFormatted}-edit-button`}
              disableFocusRipple={true}
              disableRipple={true}
              onClick={onEditClick}
            >
              <i className="fa-solid fa-pen-circle" />
            </IconButton>
          )}
          {infoButtonText && <InfoHoverButton infoText={infoButtonText} fieldName={fieldName} />}
        </Typography>
      </div>
      {!canEdit && (
        <span className={classes.markdownPreview}>
          <TextContent text={updatedFieldValue} emptyText={UNSET_FIELD_TEXT} markdown={true} />
        </span>
      )}
      {canEdit && (
        <div className={classes.editor}>
          <div className={classes.textInputDiv}>
            {!isEditing && (
              <span className={classes.markdownPreview}>
                <TextContent
                  text={updatedFieldValue}
                  emptyText={UNSET_FIELD_TEXT}
                  markdown={true}
                />
              </span>
            )}
            {isEditing && (
              <>
                {useMarkdown && (
                  <SimpleMdeReact
                    disabled={isPendingSave}
                    onChange={onChange}
                    options={editorOptions}
                    value={updatedFieldValue}
                  />
                )}
                {!useMarkdown && (
                  <TextField
                    id="outlined-basic"
                    className={classes.textInput}
                    data-cy={`${cypressFieldNameFormatted}-text-field`}
                    defaultValue={updatedFieldValue}
                    disabled={isPendingSave}
                    onChange={onChangeEvent}
                    variant="outlined"
                  />
                )}
                <Button
                  aria-label={`Save ${fieldName} changes`}
                  className={classes.saveButton}
                  color="primary"
                  data-cy={`${cypressFieldNameFormatted}-save-button`}
                  disabled={!hasFieldValueChanged || isPendingSave}
                  onClick={onSaveClick}
                  type="button"
                  variant="contained"
                >
                  {isPendingSave ? <CircularProgress size={25} /> : 'SAVE'}
                </Button>
                <Button
                  aria-label={`Cancel ${fieldName} changes`}
                  data-cy={`${cypressFieldNameFormatted}-cancel-button`}
                  onClick={onCancel}
                  disabled={isPendingSave}
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
    </div>
  );
}
export default withStyles(styles)(EditableFieldView);
