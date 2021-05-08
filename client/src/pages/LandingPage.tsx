import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const LandingPage = (props: any) => {

  useEffect(() => {
    axios.get('/api/test')
      .then(response => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get('/api/user/logout').then(rep => {
      if (rep.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃 실패');
      }
    });
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작</h2>

      <button onClick={onClickHandler}>
        Logout
      </button>
    </div>
  );
};

export default withRouter(LandingPage);