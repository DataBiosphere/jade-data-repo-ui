import { CustomTheme } from '@mui/material';

export const styles = (theme: CustomTheme) => {
  return {
    // General
    contentContainer: {
      marginTop: '1rem',
      maxWidth: 1000,
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flexCol: {
      display: 'flex',
      flexDirection: 'column',
    },
    // forms
    formFieldContainer: {
      minHeight: 135,
    },
    formFieldDescription: {
      marginBottom: 10,
    },
    formLabel: {
      display: 'block',
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    formLabelError: {
      color: theme.palette.error.main,
    },
    formInput: {
      width: '100%',
      backgroundColor: 'white',
    },
    formInputError: {
      color: theme.palette.error.main,
      fontSize: '0.75rem',
      lineHeight: '1.66',
      marginLeft: 14,
    },
    // Icons
    iconButton: {
      backgroundColor: 'rgba(77, 114, 170, .2)',
      height: '2.6rem',
      width: '2.6rem',
      borderRadius: '100%',
      marginRight: 6,
      fontSize: '1.4rem',
    },
    // The dataset table expander view
    schemaBuilderStructureViewContent: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 10,
      height: 400,
      'overflow-y': 'scroll',
      marginTop: 15,
      padding: 15,
      border: '1px solid rgba(0, 0, 0, .2)',
    },
    schemaBuilderStructureViewContentTableName: {
      display: 'flex',
      alignItems: 'center',
    },
    schemaBuilderStructureViewContentTableName_text: {
      padding: '0px 6px',
      borderRadius: theme.shape.borderRadius,
      'text-transform': 'none',
      fontWeight: 'bold',
      color: 'black',
      minWidth: 'unset',
    },
    schemaBuilderStructureViewContentTableName_selected: {
      backgroundColor: 'rgba(77, 114, 170, .2)',
      '&:hover': {
        backgroundColor: 'rgba(77, 114, 170, .4)',
      },
    },
    schemaBuilderStructureViewColumnContainer_wrapper: {
      position: 'relative',
    },
    schemaBuilderStructureViewColumnContainer: {
      marginLeft: 20,
      marginTop: -11,
      marginBottom: -10,
      paddingLeft: 20,
      paddingTop: 5,
      borderLeft: '1px dashed #A6B8D4',
    },
    schemaBuilderStructureColumnContainer_expanded: {
      marginBottom: 20,
    },
    schemaBuilderStructureViewContentColumn_dotContainer: {
      position: 'absolute',
      bottom: -1,
      color: '#A6B8D4',
      padding: '0 15px 7px',
      background: 'linear-gradient(0, white 70%, transparent 30%)',
    },
    schemaBuilderStructureViewContentColumn_dot: {
      fontSize: 11,
    },
    schemaBuilderStructureViewContentColumn: {
      display: 'block',
      marginTop: 4,
      fontWeight: 'normal',
    },
  };
};
