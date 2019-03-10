import React from 'react';
import config from 'config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import JadeTable from './table/JadeTable';

class HomeView extends React.PureComponent {
  static propTypes = {
    studies: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { studies } = this.props;
    const columns = [
      { id: 1, label: 'Study Name', property: 'name' },
      { id: 2, label: 'Description', property: 'description' },
      { id: 3, label: 'Last changed', property: 'createdDate' },
      { id: 4, label: 'Date created', property: 'modifiedDate' },
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
