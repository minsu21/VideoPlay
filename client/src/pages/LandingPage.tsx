import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Col, Row, Avatar, Typography } from 'antd';
import moment from 'moment';

const LandingPage = (props: any) => {
  const {Title} = Typography;
  const {Meta} = Card;
  const [video, setVideo] = useState([]);
  
  useEffect(() => {
    axios.get('/api/video/list').then(response => {
      console.log('/api/video/list', response);
      if (response.data.success) {
        setVideo(response.data.videos);
      } else {
        alert('최근영상을 가져오지 못했습니다.');
      }
    });
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

  const cards = () => {
    return video.map((data: any, index) => {
      const minutes = Math.floor(data.duration / 60);
      const seconds = Math.floor(data.duration - minutes * 60);
      return (
        <Col lg={6} md={8} xs={24}>
          <a href={`/video/${data._id}`}>
            <div style={{position: 'relative'}}> 
              <img style={{width: '100%'}} src={`http://localhost:8000/${data.thumbnail}`} alt='thumbnail' />
              <div className='duration'>
                <span>{minutes} : {seconds}</span>
              </div>
            </div>
          </a>
          <br />
          <Meta
            avatar={
              <Avatar src={data.writer.image} />
            }
            title={data.title}
            description='' />
          <span>{data.writer.name}</span>
          <span style={{marginLeft: '3rem'}}>{data.views} 시청</span> - <span>{moment(data.createAt).format('yyyy-MM-DD')}</span>
        </Col>
      )
    })
  };

  return (
    <div style={{width: '85%', margin: '3rem auto'}}>
      <Title level={2}>최근 영상</Title>
      <hr />
      <Row gutter={[32, 16]}>
        {cards()}
      </Row>
    </div>
  );
};

export default withRouter(LandingPage);