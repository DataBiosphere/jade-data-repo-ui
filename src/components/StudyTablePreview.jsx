import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getStudyTablePreview } from 'actions/index';
import TableChart from '@material-ui/icons/TableChartOutlined';
import PreviewTable from './table/PreviewTable';
import TablePicker from './TablePicker';

const styles = theme => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '24px',
  },
  tableIcon: {
    verticalAlign: 'text-bottom',
    marginRight: '.25em',
  },
});

export class StudyTablePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: props.study.schema.tables[0].name,
      pickerOpen: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    study: PropTypes.object,
  };

  componentDidMount() {
    const { currentTable } = this.state;
    this.loadPreview(currentTable);
  }

  loadPreview(tableName) {
    const { dispatch, study } = this.props;
    dispatch(getStudyTablePreview(study, tableName));
  }

  getTable() {
    const { study } = this.props;
    const { currentTable } = this.state;
    if (study && study.schema) {
      return study.schema.tables.find(t => t.name === currentTable);
    }
    return null;
  }

  openTablePicker = () => {
    this.setState({ pickerOpen: true });
  };

  pickTable = tableName => {
    this.setState({ pickerOpen: false, currentTable: tableName });
    this.loadPreview(tableName);
  };

  render() {
    const { classes, study } = this.props;
    const { currentTable, pickerOpen } = this.state;
    return (
      <div>
        <div>
          <TableChart className={classes.tableIcon} onClick={this.openTablePicker} />
          <span className={classes.title}>{currentTable}</span>
        </div>
        {pickerOpen ? (
          <TablePicker
            tables={study.schema.tables}
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
    study: state.studies.study,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyTablePreview));
