import React from 'react';
import PropTypes from 'prop-types';
import { createDataset } from 'actions/index';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class ManageUsersView extends React.PureComponent {
  constructor(props) {
    super(props),
    this.state = {
      newEmail: '',
      emailValid: false,
    }
  }
  static propTypes = {
    defaultValue: PropTypes.string,
    addReader: PropTypes.func.isRequired,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func.isRequired,
  };

  validateEmail(newEmail) {
    this.setState({newEmail});
    if(newEmail && newEmail.length > 0 && newEmail.length < 64 && newEmail.indexOf('@') > -1) {
      this.setState({ emailValid: true });
    }
  }

  render() {
    const { addReader, defaultValue, readers, removeReader} = this.props;
    const { emailValid, newEmail } = this.state;

    return (
      <div>
        <div>
          <TextField
            placeholder={defaultValue || "New" }
            onChange={(e) => this.validateEmail(e.target.value)}
            style={{width: '300px'}}
            variant="outlined"
          />
          <Button
            color="primary"
            disabled={!emailValid}
            onClick={() => addReader(newEmail)}
            type="button"
            variant="contained"
          >
            ADD
          </Button>
        </div>
        <div>
          {readers.map(reader =>
            (<div key={reader} >
              {reader}
              <Button
                onClick={() => removeReader(reader)}
                size="small"
              >
                x
              </Button>
            </div>)
          )}
        </div>
      </div>
    );
  }
}

export default ManageUsersView;
