import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';

export class CategoryFilterGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
    };
  }

  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
    values: PropTypes.array,
  };

  handleChange = box => {
    const { handleChange } = this.props;
    const { selected } = this.state;
    let selectedClone = _.clone(selected);
    if (box.value) {
      selectedClone[box.name] = box.value;
      this.setState({
        selected: selectedClone,
      });
    } else {
      delete selectedClone[box.name];
      this.setState({ selected: selectedClone });
    }
    handleChange({ target: { value: selectedClone } });
  };

  render() {
    const { values } = this.props;
    const checkboxes = values.map(value => {
      const name = value.f[0].v;
      const count = value.f[1].v;
      return (
        <div key={name}>
          <CategoryFilter handleChange={this.handleChange} name={name} count={count} />
        </div>
      );
    });

    return <div>{checkboxes}</div>;
  }
}

export default CategoryFilterGroup;
