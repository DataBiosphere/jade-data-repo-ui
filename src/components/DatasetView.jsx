import React from 'react';
import { connect } from 'react-redux';
import {Link, NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets } from 'actions/index';
import JadeTable from './table/JadeTable';
import moment from 'moment';

const styles = theme => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  }
});

class DatasetView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDatasets());
  }

  render() {
    const { classes, datasets } = this.props;
    const columns = [
      {
        label: 'Dataset ID',
        property: 'id',
        render: row => <Link to={`/datasets/${row.id}`}>{row.id}</Link>,
      },
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => <Link to={`/datasets/${row.id}`}>{row.name}</Link>,
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Last changed',
        property: 'modifiedDate',
        render: row => moment(row.modifiedDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'createdDate',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div>
        <div className={classes.title} >About Datasets</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div>
          DATASETS
          <NavLink to="/datasets/create"> +</NavLink>

          {datasets && datasets.datasets && <JadeTable columns={columns} rows={datasets.datasets} />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { datasets: state.datasets };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetView));
