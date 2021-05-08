import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {

  useEffect(() => {
    axios.get('/api/test')
      .then(response => console.log(response.data));
  }, []);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작</h2>
    </div>
  );
};

export default LandingPage;