import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DatasetView extends React.PureComponent {
  static propTypes = {
    datasets: PropTypes.array,
    studies: PropTypes.array,
    // dispatch: PropTypes.func.isRequired,
  };

  render() {
    return <div>Hello world home</div>;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    studies: state.studies,
  };
}

export default connect(mapStateToProps)(DatasetView);
