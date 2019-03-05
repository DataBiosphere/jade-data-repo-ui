import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DatasetView extends React.PureComponent {
  static propTypes = {};

  render() {
    return <div>Hello world studies</div>;
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(DatasetView);
