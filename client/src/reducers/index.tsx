import { combineReducers } from 'redux';
import loginUser from './user_reducer';

const rootReducer = combineReducers({
  loginUser
});

export default rootReducer;