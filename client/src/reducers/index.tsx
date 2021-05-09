import { combineReducers } from 'redux';
import loginUser from './user_reducer';

const rootReducer = combineReducers({
  user: loginUser
});

export default rootReducer;