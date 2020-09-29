import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import CreateFullSnapshotNamingView from './CreateFullSnapshotNamingView';
import ShareSnapshot from '../query/sidebar/panels/ShareSnapshot';

const CreateFullSnapshotView = ({ onDismiss, open }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  return (
    <Dialog open={open} onClose={onDismiss} fullWidth>
      {isSharing ? (
        <ShareSnapshot isModal setIsSharing={() => setIsSharing(false)} onDismiss={onDismiss} />
      ) : (
        <CreateFullSnapshotNamingView
          description={description}
          onDismiss={onDismiss}
          name={name}
          setDescription={setDescription}
          setName={setName}
          setIsSharing={setIsSharing}
        />
      )}
    </Dialog>
  );
};

CreateFullSnapshotView.propTypes = {
  onDismiss: PropTypes.func,
  open: PropTypes.bool,
};

export default CreateFullSnapshotView;
