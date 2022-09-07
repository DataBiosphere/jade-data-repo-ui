import React from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton, Typography } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import { withStyles } from '@mui/styles';
import { patchDatasetDescription } from 'actions';
import { DatasetRoles } from '../constants';

class DescriptionView extends React.PureComponent {
  constructor(props) {
    super(props);
    const descriptionInitialValue = props.description;
    this.state = {
      hasDescriptionChanged: false,
      descriptionValue: descriptionInitialValue,
    };
  }

  static propTypes = {
    datasetDescription: PropTypes.string,
    description: PropTypes.string,
    updateDescriptionFn: PropTypes.func.isRequired,
    userRoles: PropTypes.array.isRequired,
  };

  componentDidUpdate(prevState) {
    const { description } = this.props;
    const { descriptionValue } = this.state;
    if (description === descriptionValue) {
      this.setState({ hasDescriptionChanged: false });
    }
  }

  descriptionChanged(newDescription, originalDescription) {
    if (newDescription !== originalDescription) {
      this.setState({ hasDescriptionChanged: true });
    } else {
      this.setState({ hasDescriptionChanged: false });
    }
    this.setState({ descriptionValue: newDescription });
  }

  onSaveClick(descriptionText) {
    const { updateDescriptionFn } = this.props;
    updateDescriptionFn(descriptionText);
  }

  render() {
    const { description, userRoles, datasetDescription } = this.props;
    const { hasDescriptionChanged, descriptionValue } = this.state;
    const canEdit = userRoles.includes(DatasetRoles.STEWARD);

    return (
      <>
        {!canEdit && <Typography>{description}</Typography>}
        {canEdit && (
          <div>
            <TextField
              fullWidth={true}
              multiline={true}
              maxRows={5}
              minRows={2}
              onChange={(e) => this.descriptionChanged(e.target.value, description)}
              onBlur={(e) => this.descriptionChanged(e.target.value, description)}
              placeholder="Add a description."
              value={descriptionValue}
              variant="outlined"
            />
            <IconButton
              aria-label="Save description changes"
              color="primary"
              disabled={!hasDescriptionChanged}
              size="small"
              type="button"
              variant="contained"
              onClick={() => this.onSaveClick(descriptionValue)}
            >
              <SaveIcon titleAccess="Save description changes" />
            </IconButton>
            <IconButton
              aria-label="Undo description changes"
              color="primary"
              disabled={!hasDescriptionChanged}
              onClick={() => this.descriptionChanged(description, description)}
              size="small"
              type="button"
              variant="contained"
            >
              <UndoIcon titleAccess="Undo description changes" />
            </IconButton>
          </div>
        )}
      </>
    );
  }
}
export default DescriptionView;
