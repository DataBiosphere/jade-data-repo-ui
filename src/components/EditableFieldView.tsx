import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { SimpleMdeReact } from 'react-simplemde-editor';
import SimpleMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import TextContent from './common/TextContent';
import WithoutStylesMarkdownContent from './common/WithoutStylesMarkdownContent';
import InfoHoverButton from './common/InfoHoverButton';

const EditIconButton = styled(IconButton)(({ theme }) => ({
  boxShadow: 'none',
  color: theme.palette.primary?.main,
  marginTop: '-8px',
  marginBottom: '-6px',
  '&:hover': {
    color: theme.palette.primary.hover,
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  margin: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.hover,
    boxShadow: 'none',
  },
}));

interface EditableFieldViewProps {
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
    <Box data-cy={`${cypressFieldNameFormatted}-editable-field-view`}>
      <Box>
        <Typography
          sx={{ display: 'inline', textAlign: 'center' }}
          data-cy={`${cypressFieldNameFormatted}-field-name`}
          variant="h6"
        >
          {`${fieldName}:`}
          {canEdit && (
            <EditIconButton
              aria-label={`Edit ${fieldName}`}
              data-cy={`${cypressFieldNameFormatted}-edit-button`}
              disableFocusRipple={true}
              disableRipple={true}
              onClick={onEditClick}
            >
              <i className="fa-solid fa-pen-circle" />
            </EditIconButton>
          )}
          {infoButtonText && <InfoHoverButton infoText={infoButtonText} fieldName={fieldName} />}
        </Typography>
      </Box>
      {!canEdit && (
        <Box sx={{ width: '100%', display: 'flex', textAlign: 'left' }}>
          <TextContent text={updatedFieldValue} markdown={true} />
        </Box>
      )}
      {canEdit && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'top' }}>
          <Box sx={{ width: '100%' }}>
            {!isEditing && (
              <Box sx={{ width: '100%', display: 'flex', textAlign: 'left' }}>
                <TextContent text={updatedFieldValue} markdown={true} />
              </Box>
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
                    sx={{ width: '100%' }}
                    data-cy={`${cypressFieldNameFormatted}-text-field`}
                    defaultValue={updatedFieldValue}
                    disabled={isPendingSave}
                    onChange={onChangeEvent}
                    variant="outlined"
                  />
                )}
                <SaveButton
                  aria-label={`Save ${fieldName} changes`}
                  color="primary"
                  data-cy={`${cypressFieldNameFormatted}-save-button`}
                  disabled={!hasFieldValueChanged || isPendingSave}
                  onClick={onSaveClick}
                  type="button"
                  variant="contained"
                >
                  {isPendingSave ? <CircularProgress size={25} /> : 'SAVE'}
                </SaveButton>
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
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default EditableFieldView;
