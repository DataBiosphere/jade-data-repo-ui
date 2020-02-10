import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import JadeDropdown from '../JadeDropdown';

export class CreateSnapshotDropdown extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    onSelectedItem: PropTypes.func,
  };

  render() {
    const { options, onSelectedItem } = this.props;
    const assetNames = options.map(opt => opt.name);
    const initialValue = assetNames[0];

    return (
      <JadeDropdown options={assetNames} onSelectedItem={onSelectedItem} value={initialValue} />
    );
  }
}

export default CreateSnapshotDropdown;
