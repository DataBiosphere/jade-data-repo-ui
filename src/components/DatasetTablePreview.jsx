import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { getDatasetTablePreview } from 'actions/index';
import TableChart from '@mui/icons-material/TableChartOutlined';
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
    datasetPreview: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
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

  getTablePreview() {
    const { datasetPreview } = this.props;
    const { currentTable } = this.state;
    if (datasetPreview) {
      return datasetPreview[currentTable];
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
    const { classes, dataset, loading } = this.props;
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
          <PreviewTable
            loading={loading}
            table={this.getTable()}
            tablePreview={this.getTablePreview()}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    datasetPreview: state.datasets.datasetPreview,
    loading: state.datasets.loading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetTablePreview));
