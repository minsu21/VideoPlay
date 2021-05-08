import axios from 'axios';

export const loginUser = async (dataToSubmit: any) => {
  const request = await axios.post('/api/user/login', dataToSubmit).then(res => { return res.data });

  return {
    type: 'LOGIN_USER',
    payload : request
  };
};

export const registerUser = async (dataToSubmit: any) => {
  const request = await axios.post('/api/user/register', dataToSubmit).then(res => { return res.data });

  return {
    type: 'REGISTER_USER',
    payload : request
  };
};