import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import _ from 'lodash';
import clsx from 'clsx';
import { WithStyles, withStyles } from '@mui/styles';
import { Button, Typography, CustomTheme, Tabs, Tab } from '@mui/material';
import { OpenInNew, Error } from '@mui/icons-material';
import { TdrState } from 'reducers';
import { FormProvider, useForm } from 'react-hook-form';
import { createDataset, getBillingProfiles } from 'actions/index';
import { BillingProfileModel } from '../../../generated/tdr';
import DatasetSchemaInformationView from './DatasetSchemaInformationView';
import DatasetSchemaBuilderView from './DatasetSchemaBuilderView';

const styles = (theme: CustomTheme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  pageTitle: { ...theme.mixins.pageTitle },
  width: { ...theme.mixins.containerWidth },
  jadeLink: {
    ...theme.mixins.jadeLink,
    'text-decoration': 'underline',
    display: 'flex',
    alignItems: 'center',
  },
  jadeLinkIcon: {
    fontSize: '1rem',
    marginLeft: 3,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1em',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    marginRight: 30,
    marginTop: '1.25em',
    marginBottom: 30,
  },
  tabsRoot: {
    height: 80,
  },
  tabRoot: {
    'text-transform': 'none',
    'text-align': 'left',
  },
  tabDescription: {
    fontWeight: 'normal',
  },
  detailsColumn: {
    marginTop: '2rem',
  },
  detailsCard: {
    marginTop: '1.5rem',
    backgroundColor: theme.palette.primary.focus,
    padding: 25,
    width: 400,
    borderRadius: theme.shape.borderRadius,
  },
  helpList: {
    'list-style': 'none',
    paddingLeft: 20,
    marginTop: 10,
  },
  helpListLink: {
    marginTop: 5,
  },
  tabButton: {
    'text-transform': 'none',
    marginTop: 30,
    marginBottom: 5,
  },
  formLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  formLabelError: {
    color: theme.palette.error.main,
  },
  leftMargin: {
    marginLeft: 20,
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
});

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
  profiles: Array<BillingProfileModel>;
  dispatch: Dispatch<Action>;
}

interface TabConfig {
  description: string;
  content: any;
}

const DatasetSchemaCreationView = withStyles(styles)(({ classes, dispatch, profiles }: IProps) => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const changeTab = (_event: any, newCurrentTab: any) => setCurrentTab(newCurrentTab);

  const formMethods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      terraProject: '',
      enableSecureMonitoring: 'true',
      cloudPlatform: 'gcp',
      defaultProfile: '',
      region: '',
      stewards: [],
      custodians: [],
      schema: {},
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const tabs: TabConfig[] = [
    {
      description: 'Provide dataset information',
      content: <DatasetSchemaInformationView profiles={profiles} />,
    },
    {
      description: 'Build a schema and create dataset',
      content: <DatasetSchemaBuilderView />,
    },
  ];

  const onSubmit = (data: any) => {
    const defaultProfile = _.find(
      profiles,
      (x: BillingProfileModel) => x.profileName === data.defaultProfile,
    );
    const normalizedData = {
      ...data,
      policies: {
        stewards: data.stewards,
        custodians: data.custodians,
      },
      defaultProfileId: defaultProfile ? defaultProfile.id : data.defaultProfile,
    };
    delete normalizedData.terraProject;
    delete normalizedData.stewards;
    delete normalizedData.custodians;
    delete normalizedData.defaultProfile;

    dispatch(createDataset(normalizedData));
  };

  useEffect(() => {
    dispatch(getBillingProfiles());
  }, [dispatch]);

  return (
    <div className={classes.pageRoot}>
      <FormProvider {...formMethods}>
        <form className={classes.contentContainer} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.mainContent}>
            <Typography variant="h3" className={classes.pageTitle}>
              Create a dataset schema for ingesting data
            </Typography>
            Before you can ingest data files, you need to define the structure of the data you'll be
            ingesting by specifying the schema of the data. The schema is a template for the data
            you'll ingest later. You'll specify the number and names of the data categories - the
            tables and columns within the tables - and any associations between columns in separate
            tables, if multiple tables contain the same data category (for instance, if you have a
            "subject" table and a "sample" table, and both tables contain a column of the same
            subject IDs).
            <Tabs classes={{ root: classes.tabsRoot }} value={currentTab} onChange={changeTab}>
              {tabs.map((tabConfig: TabConfig, i: number) => (
                <Tab
                  key={`dataset-schema-creation-tab-${i}`}
                  label={
                    <div>
                      <Typography variant="h3">Step {i + 1}</Typography>
                      <div className={classes.tabDescription}>{tabConfig.description}</div>
                    </div>
                  }
                  className={classes.tabRoot}
                  disableFocusRipple
                  disableRipple
                />
              ))}
            </Tabs>
            {tabs.map((tabConfig: TabConfig, i: number) => (
              <div key={`dataset-schema-creation-tabpanel-${i}`} hidden={currentTab !== i}>
                {tabConfig.content}

                {i < tabs.length - 1 ? (
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    type="button"
                    className={classes.tabButton}
                    onClick={() => setCurrentTab(i + 1)}
                  >
                    Go to Step {i + 2}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    disableElevation
                    variant="contained"
                    type="submit"
                    className={classes.tabButton}
                  >
                    Create dataset
                  </Button>
                )}
                {i > 0 && (
                  <Button
                    className={clsx(classes.tabButton, classes.leftMargin)}
                    color="primary"
                    variant="outlined"
                    disableElevation
                    type="button"
                    size="medium"
                    onClick={() => setCurrentTab(i - 1)}
                  >
                    Go back to Step {i}
                  </Button>
                )}

                {_.keys(errors).length > 0 && (
                  <>
                    <div className={clsx(classes.formLabelError, classes.flexRow)}>
                      <Error style={{ marginRight: 5 }} />
                      There are errors with your form. Please fix these fields to continue:
                    </div>
                    <div className={classes.formLabelError}>
                      <ul>
                        {_.keys(errors).map((error: string) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className={classes.detailsColumn}>
            <div className={classes.detailsCard}>
              <Typography variant="h4" className={classes.pageTitle}>
                Have questions?
              </Typography>
              Learn more about ingesting data into the Terra Data Repo:
              <ul className={classes.helpList}>
                <li>
                  <a
                    className={clsx(classes.jadeLink, classes.helpListLink)}
                    href="#"
                    target="_blank"
                  >
                    Dataset schema overview <OpenInNew className={classes.jadeLinkIcon} />
                  </a>
                </li>
                <li>
                  <a
                    className={clsx(classes.jadeLink, classes.helpListLink)}
                    href="#"
                    target="_blank"
                  >
                    How to create dataset assets in TDR
                    <OpenInNew className={classes.jadeLinkIcon} />
                  </a>
                </li>
              </ul>
            </div>

            <div className={classes.detailsCard}>
              Once the dataset schema is created, you'll have tools on the dataset summary page to
              view the dataset and ingest data files for each table
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
    profiles: state.profiles.profiles,
  };
}

export default connect(mapStateToProps)(DatasetSchemaCreationView);
