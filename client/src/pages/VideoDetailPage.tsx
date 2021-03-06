import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Col, Row, List, Avatar, Typography } from 'antd';
import SideVideo from '../components/Sections/SideVideo';
import Subscribe from '../components/Subscribe';
import Comment from '../components/Comment';
import LikeDislikes from '../components/LikeDislikes';

const VideoDetailPage = (props: any) => {
  const videoId = props.match.params.videoId;
  const [video, setVideo] = useState({
    filePath: '',
    writer: {
      _id: '',
      image: '',
      name: '',
    },
    description: ''
  });
  const [comment, setComment] = useState([]);

  const refreshComment = (newComment: any) => {
    setComment(comment.concat(newComment));
  };

  useEffect(() => {
    const variable = {
      videoId: videoId
    };

    axios.post('/api/video/detail', variable).then(response => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert('비디오 정보를 가져오지 못했습니다.');
      }
    });

    axios.post('/api/comment/getComments', variable).then(response => {

      if (response.data.success) {
        setComment(response.data.comment);
      } else {
        alert('댓글 정보를 가져오지 못했습니다.');
      }
    });

  }, []);

  const isSubscribeButton = video.writer._id !== localStorage.getItem('userId') && 
    <Subscribe userTo={video.writer._id} userFrom={localStorage.getItem('userId')} />;

  if (video.writer._id !== '') {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{padding: '3rem 4rem'}}>
            <video style={{width: '100%'}} src={`http://localhost:8000/${video.filePath}`} controls />
  
            <List.Item
              actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, isSubscribeButton]}
            >
              <List.Item.Meta
                avatar={<Avatar src={video.writer.image} />}
                title={video.writer.name}
                description={video.description}
              />
            </List.Item>
  
            {/* 댓글 */}
            <Comment refresh={refreshComment} comments={comment} videoId={videoId} />

  
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
  
      </Row>
    );
  } else {
    return <div>Loading...</div>
  }
};

export default withRouter(VideoDetailPage);