import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetTablePreview } from 'actions/index';
import TableChart from '@material-ui/icons/TableChartOutlined';
import PreviewTable from './table/PreviewTable';
import TablePicker from './TablePicker';

const styles = (theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '24px',
  },
  tableIcon: {
    verticalAlign: 'text-bottom',
    marginRight: '.25em',
  },
});

export class DatasetTablePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: props.dataset.schema.tables[0].name,
      pickerOpen: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { currentTable } = this.state;
    this.loadPreview(currentTable);
  }

  loadPreview(tableName) {
    const { dispatch, dataset } = this.props;
    dispatch(getDatasetTablePreview(dataset, tableName));
  }

  getTable() {
    const { dataset } = this.props;
    const { currentTable } = this.state;
    if (dataset && dataset.schema) {
      return dataset.schema.tables.find((t) => t.name === currentTable);
    }
    return null;
  }

  openTablePicker = () => {
    this.setState({ pickerOpen: true });
  };

  pickTable = (tableName) => {
    this.setState({ pickerOpen: false, currentTable: tableName });
    this.loadPreview(tableName);
  };

  render() {
    const { classes, dataset } = this.props;
    const { currentTable, pickerOpen } = this.state;
    return (
      <div>
        <div>
          <TableChart className={classes.tableIcon} onClick={this.openTablePicker} />
          <span className={classes.title}>{currentTable}</span>
        </div>
        {pickerOpen ? (
          <TablePicker
            tables={dataset.schema.tables}
            currentTable={currentTable}
            pickTable={this.pickTable}
          />
        ) : (
          <PreviewTable table={this.getTable()} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetTablePreview));
