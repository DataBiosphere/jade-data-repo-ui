import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { WithStyles, withStyles } from '@mui/styles';
import { Typography, CustomTheme, Tabs, Tab } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { TdrState } from 'reducers';
import TabPanel from '../../common/TabPanel';

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
    marginTop: '1rem',
  },
  detailsCard: {
    marginTop: '1.5rem',
    backgroundColor: theme.palette.primary.focus,
    padding: 25,
    minWidth: 400,
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
});

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
}

interface TabConfig {
  description: string,
  content: any,
}

const DatasetSchemaCreationView = withStyles(styles)(
  ({ classes }: IProps) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event: any, newValue: any) => {
      setValue(newValue);
    };

    const tabs: TabConfig[] = [
      {
        description: 'Provide dataset information',
        content: (
          <div>Step 1!</div>
        ),
      },
      {
        description: 'Build a schema and create dataset',
        content: (
          <div>Step 2!</div>
        ),
      },
    ];

    return (
      <div className={classes.pageRoot}>
        <div className={classes.contentContainer}>
          <div className={classes.mainContent}>
            <Typography variant="h3" className={classes.pageTitle}>
              Create a dataset schema for ingesting data
            </Typography>
            Before you can ingest data files, you need to define the structure of the 
            data you'll be ingesting by specifying the schema of the data. The schema 
            is a template for the data you'll ingest later. You'll specify thenumber 
            and names of the data categories - the tables and columns within the 
            tables - and any associations between columns in separate tables, if 
            multiple tables contain th esame data category (for instance, if you have 
            a "subject" table and a "sample" table, and both tables contain a column 
            of the same subject IDs).

            <Tabs
              classes={{ root: classes.tabsRoot }}
              value={value}
              onChange={handleChange}
            >
              {
                tabs.map((tabConfig: TabConfig, i: number) => <Tab
                  key={`dataset-schema-creation-tab-${i}`}
                  label={(
                    <div>
                      <Typography variant="h3">Step {i + 1}</Typography>
                      <div className={classes.tabDescription}>{tabConfig.description}</div>
                    </div>
                  )}
                  className={classes.tabRoot}
                  disableFocusRipple
                  disableRipple
                />)
              }
            </Tabs>

            {tabs.map((tabConfig: TabConfig, i: number) => (
              <TabPanel value={value} index={i} key={`dataset-schema-creation-tabpanel-${i}`}>
                {tabConfig.content}
              </TabPanel>
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
                  <a className={clsx(classes.jadeLink, classes.helpListLink)} href="#" target="_blank">
                    Dataset schema overview <OpenInNew className={classes.jadeLinkIcon}/>
                  </a>
                </li>
                <li>
                  <a className={clsx(classes.jadeLink, classes.helpListLink)} href="#" target="_blank">
                    How to create dataset assets in TDR <OpenInNew className={classes.jadeLinkIcon}/>
                  </a>
                </li>
              </ul>
            </div>

            <div className={classes.detailsCard}>
              Once the dataset schema is created, you'll have tools on the dataset 
              summary page to view the dataset and ingest data files for each table
            </div>
          </div>
        </div>
      </div>
    );
  },
);

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(DatasetSchemaCreationView);
