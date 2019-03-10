import React from 'react';
import config from 'config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import JadeTable from './table/JadeTable';

class HomeView extends React.PureComponent {
  static propTypes = {
    studies: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { studies } = this.props;
    const columns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/studies/${row.id}`}>{row.name}</Link>,
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
        <h1>{config.description} at a glance</h1>
        <JadeTable columns={columns} rows={studies} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { studies: state.studies };
}

export default connect(mapStateToProps)(HomeView);
