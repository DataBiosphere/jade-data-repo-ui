import React from 'react';
import config from 'config';

class HomeView extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Welcome to the {config.description}</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div>Put the collections component here</div>
      </div>
    );
  }
}

export default HomeView;
