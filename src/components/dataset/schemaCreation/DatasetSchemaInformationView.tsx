import React, { useEffect, useMemo, useState } from 'react';
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
import { CLOUD_PLATFORMS } from 'constants/index';
import { isValidEmail } from '../../../libs/form-validators';
import { BillingProfileModel } from '../../../generated/tdr';
import WithoutStylesMarkdownContent from '../../common/WithoutStylesMarkdownContent';
import { styles as DatasetSchemaStyles } from './DatasetSchemaCommon';

const styles = (theme: CustomTheme) =>
  ({
    ...DatasetSchemaStyles(theme),
  } as any);

interface IProps extends WithStyles<typeof styles> {
  profiles: Array<BillingProfileModel>;
}

const DatasetSchemaInformationView = withStyles(styles)(({ classes, profiles }: IProps) => {
  const [regionOptions, setRegionOptions] = useState(CLOUD_PLATFORMS.gcp.regions);
  const [cloudPlatform, setCloudPlatform] = useState(CLOUD_PLATFORMS.gcp.key);
  const [profileOptions, setProfileOptions] = useState<Array<BillingProfileModel>>([]);
  const {
    register,
    control,
    setValue,
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

  useEffect(() => {
    setProfileOptions(
      profiles.filter(
        (p) => p.cloudPlatform === _.get(CLOUD_PLATFORMS, [cloudPlatform, 'platform']),
      ),
    );
  }, [profiles, setProfileOptions, cloudPlatform]);

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
            required: 'Name is required',
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
          Dataset description
        </label>
        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: { value: 10000, message: 'Description must be under 10,000 characters' },
          }}
          render={({ field }) => (
            <>
              <SimpleMdeReact
                options={editorOptions}
                {...field}
                placeholder="Dataset description"
              />
              {errors.description && (
                <span className={classes.formInputError}>{errors.description.message}</span>
              )}
            </>
          )}
        />
      </Grid>

      <Grid item xs={6} data-cy="dataset-region">
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
                const selectedCloudPlatform = event.target.value;
                setValue('region', null);
                setValue('defaultProfileId', null);
                setRegionOptions(_.get(CLOUD_PLATFORMS, [selectedCloudPlatform, 'regions']));
                setCloudPlatform(selectedCloudPlatform);
                field.onChange(event, change);
              }}
              placeholder="Cloud platform"
            >
              {_.map(CLOUD_PLATFORMS, (value: any, key: string) => (
                <MenuItem value={key} key={key}>
                  {value.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <label
          htmlFor="dataset-defaultProfileId"
          className={clsx(classes.formLabel, { [classes.formLabelError]: errors.defaultProfile })}
        >
          Billing Profile*
        </label>
        <Controller
          name="defaultProfileId"
          control={control}
          rules={{ required: 'default billing profile is required' }}
          render={({ field }) => (
            <Autocomplete
              id="dataset-defaultProfileId"
              options={profileOptions}
              className={classes.formInput}
              isOptionEqualToValue={(option, value) => value.profileName === option.profileName}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={!!errors.defaultProfileId}
                  helperText={errors.defaultProfileId ? errors.defaultProfileId.message : ''}
                  placeholder="Default billing profile"
                />
              )}
              getOptionLabel={(option: BillingProfileModel) => option.profileName || ''}
              {...field}
              onChange={(_event: any, change: any) => {
                field.onChange(change);
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={6} className={classes.formFieldContainer} data-cy="dataset-region">
        <label
          htmlFor="dataset-region"
          className={clsx(classes.formLabel, { [classes.formLabelError]: errors.region })}
        >
          Region*
        </label>
        <Controller
          name="region"
          control={control}
          rules={{ required: 'Region is required' }}
          render={({ field }) => (
            <Autocomplete
              id="dataset-region"
              options={regionOptions}
              className={classes.formInput}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={!!errors.region}
                  helperText={errors.region ? errors.region.message : ''}
                  placeholder="Cloud region"
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
            validate: { isValidEmail },
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
                  placeholder="username@email.com"
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
          Custodians
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
              isValidEmail,
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
                  placeholder="username@email.com"
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
