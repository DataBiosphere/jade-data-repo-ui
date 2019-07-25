import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import JadeTable from './JadeTable';

const styles = theme => ({
  wrapper: {
    paddingTop: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: '600',
    paddingTop: '30px',
  },
  jadeLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class PreviewTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    table: PropTypes.object.isRequired,
  };

  render() {
    const { classes, table } = this.props;
    if (!table.preview) {
      return <div>No data.</div>;
    }
    const columns = table.columns.map((col, j) => ({
      label: col.name,
      property: col.name,
      render: row => row.f[j + 1].v,
    }));
    const keyFn = row => row.f[0].v;
    return (
      <JadeTable
        columns={columns}
        rowKey={keyFn}
        rows={table.preview}
        summary={true}
        itemType="rows"
      />
    );
  }
}

export default withStyles(styles)(PreviewTable);
