import React from 'react';

class HelpContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleHelpButtonClick = this.handleHelpButtonClick.bind(this);
    this.handleHelpExitClick = this.handleHelpExitClick.bind(this);
    this.state = { helpExpanded: false };
  }

  handleHelpButtonClick() {
    this.setState({ helpExpanded: true });
  }

  handleHelpExitClick() {
    this.setState({ helpExpanded: false });
  }

  render() {
    const { helpExpanded } = this.state;
    if (helpExpanded) return <div> HELP IS EXPANDED!</div>;
    return <div>help</div>;
  }
}

export default HelpContainer;
