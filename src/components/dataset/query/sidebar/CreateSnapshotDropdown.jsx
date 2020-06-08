import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import JadeDropdown from '../JadeDropdown';

export class CreateSnapshotDropdown extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    onSelectedItem: PropTypes.func,
    value: PropTypes.string,
  };

  render() {
    const { value, options, onSelectedItem } = this.props;
    const assetNames = options.map((opt) => opt.name);

    return (
      <JadeDropdown
        options={assetNames}
        onSelectedItem={onSelectedItem}
        value={value}
        name="Select Asset"
      />
    );
  }
}

export default CreateSnapshotDropdown;
