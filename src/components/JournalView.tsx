import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import 'easymde/dist/easymde.min.css';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { TdrState } from 'reducers';
import { JournalEntryModel } from 'generated/tdr';

const styles = () =>
  createStyles({
    className: {
      color: 'red',
    },
  } as const);

interface JournalViewProps extends WithStyles<typeof styles> {
  id: string;
  journals: JournalEntryModel[];
  loading: boolean;
}

function JournalView({ journals, loading }: JournalViewProps) {
  // const [hasJournalChanged, setHasJournalChanged] = useState(false);
  // const [descriptionValue, setJournalValue] = useState(description);
  // const [isEditing, setIsEditing] = useState(false);
  // const [isPendingSave, setIsPendingSave] = useState(false);

  useEffect(() => {
    if (loading) {
      console.log('journals!', journals);
    }
  }, [journals, loading]);

  return <div>JOURNAL TAB</div>;
}

function mapStateToProps(state: TdrState) {
  return {
    journals: state.journals.journals,
    loading: state.journals.journalsLoading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JournalView));
