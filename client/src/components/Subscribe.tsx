import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';

const Subscribe = (props: any) => {
  const [count, setCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    console.log('Subscribe>>>>>>>>>>>>>>>', count);
    const variable = {
      userTo: props.userTo
    };
    const subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom
    };  

    axios.post('/api/subscribe/count', variable).then(response => {
      console.log('Subscribe222', count);

      if (response.data.success) {
        setCount(response.data.subscribeCount);
      } else {
        alert('구독자 수를 가져오지 못했습니다.');
      }
    });
    
    axios.post('/api/subscribe/subscribed', subscribeVariable).then(response => {
      if (response.data.success) {
        setSubscribed(response.data.subscribed);
      } else {
        alert('구독정보를 받아오지 못했습니다.');
      }
    });
  }, []);

  const onSubscribe = () => {
    const subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom
    };

    if (subscribed) {
      axios.post('/api/subscribe/unSubscribe', subscribedVariable).then(response => {
        if (response.data.success) {
          console.log('subscribe', response.data);
          setCount(count - 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독 취소를 실패했습니다.');
        }
      });
    } else {
      axios.post('/api/subscribe/subscribe', subscribedVariable).then(response => {
        if (response.data.success) {
          console.log('subscribe', response.data);
          setCount(count + 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독을 실패했습니다.');
        }
      });
    }
  };

  return (
    <div>
      <Button style={{ 
          background: `${subscribed ? '#AAAAAA' : '#CC0000'}`, 
          borderColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`
        }} type='primary' size='large'
        onClick={onSubscribe}
      >
        {count} {subscribed ? 'subscribed' : 'subscribe'}
      </Button>

    </div>
  )
};

export default Subscribe;