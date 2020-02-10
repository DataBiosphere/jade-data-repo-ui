import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import AppliedFilterList from './AppliedFilterList';

const styles = () => ({
  filterHeader: {
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: 'inherit',
  },
  rangeInfo: {
    display: 'inline',
  },
  inline: {
    margin: '2px',
  },
});

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    selected: PropTypes.string,
  };

  render() {
    const { filterData, selected } = this.props;
    const listTables = _.keys(filterData).map(table => {
      return <AppliedFilterList table={table} selected={selected} />;
    });

    return (
      <Card>
        <List subheader={<ListSubheader component="div">Properties</ListSubheader>}>
          {listTables}
        </List>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QuerySidebarPanel));
