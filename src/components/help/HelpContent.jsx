import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = () => ({
  panelContainer: {
    'padding-left': '1em',
    'padding-right': '1em',
    display: 'flex',
    'flex-direction': 'column',
    height: 'calc(100% - 100px)',
  },
  body: {
    'flex-grow': 1,
    overflow: 'auto',
    'min-height': '2em',
    'padding-left': '1em',
    'padding-right': '1em',
  },
  titleContainer: {
    'padding-left': '1em',
  },
  sectionTitle: {
    'margin-bottom': '10px',
    'margin-top': '10px',
  },
  noTopMargin: {
    'margin-top': 0,
    'margin-bottom': '10px',
  },
  firstParagraph: {
    'margin-top': 0,
  },
});

class HelpContent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.panelContainer}>
        <div className={classes.titleContainer}>
          <h1 className={classes.sectionTitle}>What is the Terra Data Repository?</h1>
        </div>
        <div className={classes.body}>
          <h3 className={classes.noTopMargin}>Support complex schemas</h3>
          <p className={classes.firstParagraph}>
            Our goal is to allow overlapping sets of data to have different access. A single
            collection of data should be capable of being sliced and diced in different ways,
            without making extra copies. We want the Terra Data Repository to be extremely
            versatile, while being efficient in terms of how much storage it requires, so as to
            minimize the cost.
          </p>
          <h3 className={classes.sectionTitle}>Datasets</h3>
          <p className={classes.firstParagraph}>
            A dataset is a container holding a set of related data. A datum is owned by exactly one
            dataset. A dataset defines the layout (schema) of the data it holds. The data layout of
            the dataset is stored in the Repository Metadata. The data of the dataset is Primary
            Data.
          </p>
          <p>
            The Terra Data Repository will support many datasets, managed by different people and
            containing different kinds of data. For example, one dataset might be a
            participant-sample schema primarily focused on sequencer files while another might have
            a schema primarily focused on electronic health records.
          </p>
          <h3 className={classes.sectionTitle}>Data snapshots</h3>
          <p className={classes.firstParagraph}>
            The Snapshot is the key element for most users. A data Snapshot is a view of all or part
            of one or more studies. A data snapshot is a slice of a single dataset. For example, a
            Snapshot could be the data for samples funded by one organization, or the subset of
            individuals matching a specific criteria not common to everyone in their cohort.
          </p>
          <p>
            The data snapshot is a unit of access control management. Access is granted to a data
            snapshot and applies to all data in view of the data snapshot. Data snapshots are
            immutable: they provide an unchanging view of the base data; changes to the base data
            are not visible in the data snapshot view. Making data snapshots immutable allows
            analysis to be reproducible over time. There may be exceptions; for example, revocation
            of consent might require removal of data. However, that is based on the dataset owner’s
            policy. The operation is enabled by TDR, but is not required.
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HelpContent);
