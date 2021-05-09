import React from 'react'
import Icon  from '@ant-design/icons';

const Footer = () => {
  return (
    <div style={{
      height: '80px', display: 'flex',
      flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontSize:'1rem'
    }}>
      <p> Video Play  <Icon type="video" /></p>
    </div>
  )
};

export default Footer;