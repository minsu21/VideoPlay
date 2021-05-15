import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Col, Row, List, Avatar, Typography } from 'antd';
import SideVideo from '../components/Sections/SideVideo';

const VideoDetailPage = (props: any) => {
  const videoId = props.match.params.videoId;
  const [video, setVideo] = useState({
    filePath: '',
    writer: {
      image: '',
      name: '',
    },
    description: ''
  });

  useEffect(() => {
    const variable = {
      videoId: videoId
    };

    axios.post('/api/video/detail', variable).then(response => {
      if (response.data.success) {
        console.log(video);

        setVideo(response.data.video);
      } else {
        alert('비디오 정보를 가져오지 못했습니다.');
      }
    });

  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col lg={18} xs={24}>
        <div style={{width: '100%', padding: '3rem 4rem'}}>
          <video style={{width: '100%'}} src={`http://localhost:8000/${video.filePath}`} controls />

          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={video.writer.image} />}
              title={video.writer.name}
              description={video.description}
            />
          </List.Item>

          {/* 댓글 */}

        </div>
      </Col>
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>

    </Row>
  );
};

export default withRouter(VideoDetailPage);