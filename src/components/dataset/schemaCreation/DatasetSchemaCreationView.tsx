import React, { Dispatch, useEffect, useRef } from 'react';
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
import { CLOUD_PLATFORMS } from '../../../constants/index';
import DatasetCreationModal from './DatasetCreationModal';

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
  profiles: Array<BillingProfileModel>;
  dispatch: Dispatch<Action>;
}

interface TabConfig {
  description: string;
  content: any;
}

const DatasetSchemaCreationView = withStyles(styles)(({ classes, dispatch, profiles }: IProps) => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const updateTab = (tab: number) => {
    // Reset scroll on tab change
    ref.current?.parentElement?.scrollTo(0, 0);
    setCurrentTab(tab);
  };
  const changeTab = (_event: any, newCurrentTab: number) => updateTab(newCurrentTab);

  const formMethods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      name: null,
      description: null,
      terraProject: null,
      enableSecureMonitoring: false,
      enablePhiTracking: false,
      cloudPlatform: CLOUD_PLATFORMS.gcp.key,
      defaultProfileId: null,
      region: null,
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
    const normalizedData = {
      ...data,
      defaultProfileId: data.defaultProfileId?.id,
      policies: {
        stewards: data.stewards,
        custodians: data.custodians,
      },
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
    <div className={classes.pageRoot} data-cy="component-root" ref={ref}>
      <FormProvider {...formMethods}>
        <form
          className={classes.contentContainer}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          {/* disable autocomplete in FF */}
          <input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }} />
          <div className={classes.mainContent}>
            <Typography variant="h3" className={classes.pageTitle}>
              Create a dataset schema for ingesting data
            </Typography>
            Before you can ingest data files, you need to define the structure of the data you'll be
            ingesting by specifying the schema of the data. The schema is a template for the data
            you'll ingest later. You'll specify the number and names of the data categories - the
            tables and columns within the tables - and any associations between columns in separate
            tables, if multiple tables contain the same data category (for instance, if you have a
            'subject' table and a 'sample' table, and both tables contain a column of the same
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
              <div key={`tabPanel-${i}`} hidden={currentTab !== i}>
                {tabConfig.content}

                {i < tabs.length - 1 ? (
                  <Button
                    type="button"
                    color="primary"
                    variant="contained"
                    disableElevation
                    className={classes.tabButton}
                    onClick={() => updateTab(i + 1)}
                  >
                    Go to Step {i + 2}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disableElevation
                    className={classes.tabButton}
                  >
                    Submit
                  </Button>
                )}
                {_.keys(errors).length > 0 && (
                  <>
                    <div
                      className={clsx(classes.formLabelError, classes.flexRow)}
                      data-cy="error-summary"
                    >
                      <Error style={{ marginRight: 5 }} />
                      There are errors with your form. Please fix these fields to continue:
                    </div>
                    <div className={classes.formLabelError} data-cy="error-details">
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
                    href="https://support.terra.bio/hc/en-us/articles/13817865732123-Overview-Your-TDR-dataset-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dataset schema overview <OpenInNew className={classes.jadeLinkIcon} />
                  </a>
                </li>
                <li>
                  <a
                    className={clsx(classes.jadeLink, classes.helpListLink)}
                    href="https://support.terra.bio/hc/en-us/articles/4407241197979-How-to-create-dataset-assets-in-TDR"
                    target="_blank"
                    rel="noopener noreferrer"
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
        <DatasetCreationModal />
      </FormProvider>
    </div>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    profiles: state.profiles.profiles,
  };
}

export default connect(mapStateToProps)(DatasetSchemaCreationView);
