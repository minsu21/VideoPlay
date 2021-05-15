import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../actions/user_action';
import { withRouter } from 'react-router-dom';

const RegisterPage = (props: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (event: any) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event: any) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event: any) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event: any) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event: any) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    };

    const body = {
      email: email,
      name: name,
      password: password
    };

    dispatch(registerUser(body))
      .then(res => {
        if (res.payload.success) {
          props.history.push('/login')
        } else {
          alert('회원가입에 실패하였습니다.');
        };
      });
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '80vh'
    }}>

      <form style={{display:'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type='email' value={email} onChange={onEmailHandler} />
        <label>Name</label>
        <input type='text' value={name} onChange={onNameHandler} />
        <label>password</label>
        <input type='password' value={password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input type='password' value={confirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button>
          회원가입
        </button>
      </form>

    </div>
  );
};

export default withRouter(RegisterPage);