import react, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../actions/user_action';
import { withRouter } from 'react-router-dom';

/**
  option
    undefine : 모두가능
    true : 로그인 후 확인가능 페이지
    false : 로그인 후 확인불가 페이지
*/
export default function (SpecificComponent: React.ComponentType<any>, option?: boolean, adminRoute = null) {

  const AuthenticationCheck = (props: any) => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(rep => {
        console.log('auth rep', rep);

        if (!rep.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          };
        } else {
          if (adminRoute && !rep.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (!option) {
              props.history.push('/');
            };
          };
        };

      });
    }, []);

    return (
      <SpecificComponent/>
    )
  };
  
  return withRouter(AuthenticationCheck);
};