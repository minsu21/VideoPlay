import React, { useState, useEffect } from 'react'
import { Tooltip } from 'antd';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import axios from 'axios';

const LikeDislikes = (props: any) => {
  const [likes, setLikes] = useState(0);
  const [likeAction, setLikeAction] = useState(false);
  const [dislikes, setDislikes] = useState(0);
  const [dislikeAction, setDislikeAction] = useState(false);
  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId }
  }

  useEffect(() => {

    axios.post('/api/like/get', variable).then(response => {

      if (response.data.success) {
        setLikes(response.data.likes.length);

        response.data.likes.map((like: any) => {
          if (like.userId === props.userId) {
            setLikeAction(true);
          };
        });
      } else {
        alert('좋아요 정보를 가져오지 못했습니다.');
      }
    });

    axios.post('/api/dislike/get', variable).then(response => {

      if (response.data.success) {
        setDislikes(response.data.dislikes.length);

        response.data.dislikes.map((dislike: any) => {
          if (dislike.userId === props.userId) {
            setDislikeAction(true);
          };
        });
      } else {
        alert('싫어요 정보를 가져오지 못했습니다.');
      }
    });

  }, []);

  const onLike = () => {
    console.log('onLike');

    if (!likeAction) {
      axios.post('/api/like/upLike', variable).then(response => {
        if (response.data.success) {

          console.log('/api/like/upLike');

          setLikes(likes + 1);
          setLikeAction(true);

          if (dislikeAction) {
            setDislikeAction(false);
            setDislikes(dislikes - 1);
          };
        } else {
          alert('좋아요 Error');
        }
      });
    } else {
      axios.post('/api/like/unLike', variable).then(response => {
        if (response.data.success) {
          setLikes(likes - 1);
          setLikeAction(false);
        } else {
          alert('좋아요 취소 Error');
        }
      });
    }
  };

  const onDislike = () => {
    if (!dislikeAction) {
      axios.post('/api/like/upDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(dislikes + 1);
          setDislikeAction(true);

          if (likeAction) {
            setLikeAction(false);
            setLikes(likes - 1);
          };
        } else {
          alert('싫어요 Error');
        }
      });
    } else {
      axios.post('/api/like/unDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setDislikeAction(false);
        } else {
          alert('싫어요 취소 Error');
        }
      });
    }

  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          { likeAction ? <LikeFilled onClick={onLike} /> : <LikeOutlined onClick={onLike} /> }
        </Tooltip>
        <span style={{padding: '8px', cursor: 'auto'}}>{likes}</span>
      </span>

      <span key='comment-basic-dislike'>
        <Tooltip title='Dislike'>
          { dislikeAction ? <DislikeFilled onClick={onDislike} /> : <DislikeOutlined onClick={onDislike} /> }
        </Tooltip>
        <span style={{padding: '8px', cursor: 'auto'}}>{dislikes}</span>
      </span>
    </div>
  )
};

export default LikeDislikes;