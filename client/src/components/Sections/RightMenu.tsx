import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
const Upload = './assets/images/upload.png';

interface RootState {
  user: any
};

function RightMenu(props: any) {
  // const user = useSelector(state => state.user)
  const selectUser = (state: RootState) => state.user;
  const user = useSelector(selectUser);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if ((user.userData || '') === '' || !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">login</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="create">
          <a href="/video/upload"><img src={Upload} width="16px" alt="Upload" /></a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  };
};

export default withRouter(RightMenu);