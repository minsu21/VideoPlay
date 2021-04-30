import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {

  useEffect(() => {
    axios.get('/api/test')
      .then(response => console.log(response.data));
  }, []);

  return (
    <div>
      LandingPage
    </div>
  );
};

export default LandingPage;