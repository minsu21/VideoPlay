import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../actions/user_action';
import { withRouter } from 'react-router-dom';

const LoginPage = (props: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailHandler = (event: any) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event: any) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event: any) => {
    event.preventDefault();

    const body = {
      email: email,
      password: password
    };

    dispatch(loginUser(body))
      .then(res => {
        if (res.payload.login) {
          props.history.push('/')
        } else {
          alert('Error');
        };
      });
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{display:'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type='email' value={email} onChange={onEmailHandler} />
        <label>password</label>
        <input type='password' value={password} onChange={onPasswordHandler} />
        <br />
        <button>
          Login
        </button>
      </form>

    </div>
  );
};

export default withRouter(LoginPage);