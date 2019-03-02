import React from 'react';

const footerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
};

const Footer = () => (
  <div style={{ borderTop: '0.1rem solid #ddd' }}>
    <div>
      <div style={footerStyles}>
        <iframe
          title="GitHub Stars"
          src="https://ghbtns.com/github-btn.html?user=DataBiosphere&repo=jade-data-repo&type=star&count=true"
          frameBorder="0"
          scrolling="0"
          width="110px"
          height="20px"
        />
        <iframe
          title="GitHub Follow"
          src="https://ghbtns.com/github-btn.html?user=DataBiosphere&type=follow&count=true"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="20px"
        />
      </div>
    </div>
  </div>
);

export default Footer;
