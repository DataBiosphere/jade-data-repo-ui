import React, { useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WithStyles, withStyles } from '@mui/styles';
import { Typography, TextField, CustomTheme, Grid, Select, MenuItem, Autocomplete } from '@mui/material';
import { clsx } from 'clsx';
import { TdrState } from 'reducers';
import { useForm, Controller} from 'react-hook-form';
import SimpleMDE from 'easymde';
import { SimpleMdeReact } from 'react-simplemde-editor';
import WithoutStylesMarkdownContent from '../../common/WithoutStylesMarkdownContent';
import { GCP_REGIONS, AZURE_REGIONS } from 'constants/index';
import AddUserAccess, { AccessPermission } from '../../common/AddUserAccess';

const styles = (theme: CustomTheme) => ({
  contentContainer: {
    marginTop: '1rem',
  },
  form: {
    width: '100%',
  },
  formFieldContainer: {
    minHeight: 135,
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
  },
  formInputError: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    lineHeight: '1.66',
    marginLeft: 14,
  },
});

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
}

const DatasetSchemaInformationView = withStyles(styles)(({ classes }: IProps) => {
  const [regionOptions, setRegionOptions] = useState(GCP_REGIONS);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      terraProject: '',
      secureMonitoring: 'yes',
      cloudPlatform: 'gcp',
      region: '',
    },
  });

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

  const permissions: AccessPermission[] = [
    { policy: 'custodian', disabled: false },
    { policy: 'snapshot_creator', disabled: false },
    { policy: 'steward', disabled: false },
  ];

  const addUsers = (role: string, usersToAdd: string[]) => {
    console.log('users', role, usersToAdd);
  };

  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  console.log('errors', errors);

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={2} columnSpacing={5} className={classes.contentContainer}>
        <Grid item xs={12}>
          <Typography variant="h3">Dataset information</Typography>
          We need some basic information about the dataset
        </Grid>
        <Grid item xs={12} md={6} lg={6} className={classes.formFieldContainer}>
          <label
            htmlFor="dataset-name"
            className={clsx(classes.formLabel, { [classes.formLabelError]: errors.name })}
          >
            Name your dataset*
          </label>
          <TextField
            id="dataset-name"
            className={classes.formInput}
            placeholder="Dataset name"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
            {...register('name', {
              required: 'name is required',
              minLength: { value: 1, message: 'Name must be 1+ characters long' },
              maxLength: { value: 511, message: 'Name must be less than 511 characters long' },
              pattern: {
                value: /^[a-zA-Z0-9][_a-zA-Z0-9]*$/,
                message: 'Name should fit pattern: ^[a-zA-Z0-9][_a-zA-Z0-9]*$',
              },
            })}
          />
        </Grid>

        <Grid item xs={12} className={classes.formFieldContainer}>
          <label
            htmlFor="dataset-description"
            className={clsx(classes.formLabel, { [classes.formLabelError]: errors.description })}
          >
            Dataset description*
          </label>
          <Controller 
            name="description"
            control={control}
            rules={{ required: 'description is required' }}
            render={({ field }) => {
              return (
                <>
                  <SimpleMdeReact
                    options={editorOptions}
                    {...field}
                  />
                  {errors.description && <span className={classes.formInputError}>{errors.description.message}</span>}
                </>
              );
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label
            htmlFor="dataset-terraProject"
            className={clsx(classes.formLabel, { [classes.formLabelError]: errors.terraProject })}
          >
            Terra project*
          </label>
          <Controller 
            name="terraProject"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <Select id="dataset-terraProject"
                    className={classes.formInput}
                    {...field}
                  >
                    <MenuItem value={'yes'}>Yes</MenuItem>
                    <MenuItem value={'no'}>No</MenuItem>
                  </Select>
                </>
              );
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label htmlFor="dataset-secureMonitoring" className={classes.formLabel} >
            Secure monitoring
          </label>
          <Controller 
            name="secureMonitoring"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <Select id="dataset-secureMonitoring"
                    className={classes.formInput}
                    {...field}
                  >
                    <MenuItem value={'yes'}>Yes</MenuItem>
                    <MenuItem value={'no'}>No</MenuItem>
                  </Select>
                </>
              );
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label htmlFor="dataset-cloudPlatform" className={classes.formLabel} >
            Cloud Platform*
          </label>
          <Controller 
            name="cloudPlatform"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <>
                  <Select id="dataset-cloudPlatform"
                    className={classes.formInput}
                    {...field}
                    onChange={(event: any, change: any) => {
                      const cloudPlatform = event.target.value;
                      setRegionOptions(cloudPlatform === 'gcp' ? GCP_REGIONS : AZURE_REGIONS);
                      field.onChange(event, change);
                    }}
                  >
                    <MenuItem value={'gcp'}>Google Cloud Platform (GCP)</MenuItem>
                    <MenuItem value={'azure'}>Azure</MenuItem>
                  </Select>
                </>
              );
            }}
          />
        </Grid>

        <Grid item xs={6} className={classes.formFieldContainer}>
          <label
            htmlFor="dataset-region"
            className={clsx(classes.formLabel, { [classes.formLabelError]: errors.region })}
          >
            Region*
          </label>
          <Controller 
            name="region"
            control={control}
            rules={{ required: 'region is required' }}
            render={({ field }) => {
              return (
                <>
                  <Autocomplete id="dataset-region"
                    freeSolo
                    options={regionOptions}
                    className={classes.formInput}
                    renderInput={(params: any) => 
                      <TextField
                        {...params}
                        error={!!errors.region}
                        helperText={errors.region ? errors.region.message : ''}
                      />
                    }
                    {...field}
                    onChange={(_event: any, change: any) => {
                      field.onChange(change);
                    }}
                  />
                  {errors.description && <span className={classes.formInputError}>{errors.description.message}</span>}
                </>
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid xs={12}>
        <AddUserAccess permissions={permissions} onAdd={addUsers} />
      </Grid>
    </form>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(DatasetSchemaInformationView);
