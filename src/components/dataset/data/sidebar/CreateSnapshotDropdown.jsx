import React from 'react';
import PropTypes from 'prop-types';
import JadeDropdown from '../JadeDropdown';

export class CreateSnapshotDropdown extends React.PureComponent {
  static propTypes = {
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.string,
  };

  render() {
    const { value, options, onSelectedItem } = this.props;
    const assetNames = options.map((opt) => opt.name);

    return (
      <JadeDropdown
        disabled={false}
        options={assetNames}
        onSelectedItem={onSelectedItem}
        value={value}
        name="Select Asset"
      />
    );
  }
}

export default CreateSnapshotDropdown;
