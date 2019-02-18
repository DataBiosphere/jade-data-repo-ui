import React from 'react';
import styled from 'styled-components';

import Icon from 'assets/media/images/white-jade.png';

export const Logo = styled.img`
  align-items: flex-start;
  display: inline-flex;
  height: 41px;
  width: 41px;
`;

const Title = styled.span`
  color: #fff;
  position: relative;
  bottom: 12px;
  font-size: 21px;
  left: 4px;
`;

export default () => (
  <div>
    <Logo src={Icon} />
    <Title>Jade Data Repository</Title>
  </div>
);
