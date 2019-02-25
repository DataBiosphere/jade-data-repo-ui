import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class DatasetView extends React.PureComponent {
  static propTypes = {
    datasets: PropTypes.array,
  };

  render() {
    return (
      <div>
        <h2>Datasets</h2>
        <NavLink to="/datasets/create">Add</NavLink>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div>Dataset table</div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    datasets: state.datasets,
  };
}

export default connect(mapStateToProps)(DatasetView);
