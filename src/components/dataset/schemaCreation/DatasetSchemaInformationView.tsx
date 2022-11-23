import React, { useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WithStyles, withStyles } from '@mui/styles';
import {
  Typography,
  TextField,
  CustomTheme,
  Grid,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { clsx } from 'clsx';
import { TdrState } from 'reducers';
import { Controller, useFormContext } from 'react-hook-form';
import SimpleMDE from 'easymde';
import { SimpleMdeReact } from 'react-simplemde-editor';
import { GCP_REGIONS, AZURE_REGIONS } from 'constants/index';
import isEmail from 'validator/lib/isEmail';
import WithoutStylesMarkdownContent from '../../common/WithoutStylesMarkdownContent';

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
    register,
    control,
    formState: { errors },
  } = useFormContext();

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

  return (
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
          render={({ field }) => (
            <>
              <SimpleMdeReact options={editorOptions} {...field} />
              {errors.description && (
                <span className={classes.formInputError}>{errors.description.message}</span>
              )}
            </>
          )}
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
          render={({ field }) => (
            <Select id="dataset-terraProject" className={classes.formInput} {...field}>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <label htmlFor="dataset-enableSecureMonitoring" className={classes.formLabel}>
          Secure monitoring
        </label>
        <Controller
          name="enableSecureMonitoring"
          control={control}
          render={({ field }) => (
            <Select id="dataset-enableSecureMonitoring" className={classes.formInput} {...field}>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <label htmlFor="dataset-cloudPlatform" className={classes.formLabel}>
          Cloud Platform*
        </label>
        <Controller
          name="cloudPlatform"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id="dataset-cloudPlatform"
              className={classes.formInput}
              {...field}
              onChange={(event: any, change: any) => {
                const cloudPlatform = event.target.value;
                setRegionOptions(cloudPlatform === 'gcp' ? GCP_REGIONS : AZURE_REGIONS);
                field.onChange(event, change);
              }}
            >
              <MenuItem value="gcp">Google Cloud Platform (GCP)</MenuItem>
              <MenuItem value="azure">Azure</MenuItem>
            </Select>
          )}
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
          render={({ field }) => (
            <Autocomplete
              id="dataset-region"
              freeSolo
              options={regionOptions}
              className={classes.formInput}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={!!errors.region}
                  helperText={errors.region ? errors.region.message : ''}
                />
              )}
              {...field}
              onChange={(_event: any, change: any) => {
                field.onChange(change);
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} className={classes.formFieldContainer}>
        <label
          htmlFor="dataset-stewards"
          className={clsx(classes.formLabel, { [classes.formLabelError]: errors.stewards })}
        >
          Stewards
        </label>
        <div className={classes.formFieldDescription}>
          A Steward, or Data Owner, is the person who created the dataset. While they are ultimately
          liable for the data, they can assign the hands-on data management to another person by
          assigning the Custodian role.
        </div>
        <Controller
          name="stewards"
          control={control}
          rules={{
            validate: {
              isEmail: (values: string[]) => {
                const emailErrors = _.filter(values, (v: string) => !isEmail(v));
                return emailErrors.length === 0 || `Invalid emails: "${emailErrors.join('", "')}"`;
              },
            },
          }}
          render={({ field }) => (
            <Autocomplete
              id="dataset-stewards"
              freeSolo
              multiple
              options={[]}
              className={classes.formInput}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={!!errors.stewards}
                  helperText={errors.stewards ? errors.stewards.message : ''}
                />
              )}
              {...field}
              onChange={(_event: any, change: any) => {
                field.onChange(change);
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} className={classes.formFieldContainer}>
        <label
          htmlFor="dataset-custodians"
          className={clsx(classes.formLabel, { [classes.formLabelError]: errors.custodians })}
        >
          Custodians*
        </label>
        <div className={classes.formFieldDescription}>
          The Custodian role is defined on a dataset. Someone may be the Custodian for one or more
          studies. A Custodian is responsible for creating data snapshots over datasets and
          controlling access to those snapshots.
        </div>
        <Controller
          name="custodians"
          control={control}
          rules={{
            validate: {
              isEmail: (values: string[]) => {
                const emailErrors = _.filter(values, (v: string) => !isEmail(v));
                return emailErrors.length === 0 || `Invalid emails: "${emailErrors.join('", "')}"`;
              },
              minLength: (values: string[]) =>
                values.length > 0 || 'Must include at least one email',
            },
          }}
          render={({ field }) => (
            <Autocomplete
              id="dataset-custodians"
              freeSolo
              multiple
              options={[]}
              className={classes.formInput}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={!!errors.custodians}
                  helperText={errors.custodians ? errors.custodians.message : ''}
                />
              )}
              {...field}
              onChange={(_event: any, change: any) => {
                field.onChange(change);
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(DatasetSchemaInformationView);
