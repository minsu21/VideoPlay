import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Input, Button } from 'antd';
import LikeDislikes from '../components/LikeDislikes';

interface RootState {
  user: any
};

const SingleComment = (props: any) => {
  const selectUser = (state: RootState) => state.user;
  const user = useSelector(selectUser);
  const videoId = props.videoId;
  const [commentValue, setCommentValue] = useState('');
  const [openReply, setOpenReply] = useState(false);
  
  const handleClick = (event: any) => {
    setCommentValue(event.currentTarget.value);
  };

  const onClickReplayOpen = () => {
    setOpenReply(!openReply);
  };

  const actions = [
    <LikeDislikes comment userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
    <span onClick={onClickReplayOpen}  key='comment-basic-replay-to'>댓글쓰기</span>
  ];

  const onSubmit = (event: any) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoId: videoId,
      responseTo: props.comment._id
    };

    axios.post('/api/comment/save', variables).then(response => {
      if (response.data.success) {
        props.refresh(response.data.result);
        setCommentValue('');
        setOpenReply(false);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      };
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} />}
        content={props.comment.content}
      />

      { openReply &&
        <form style={{display: 'flex'}} onSubmit={onSubmit}>
          <textarea
            style={{width: '100%', borderRadius: '5px', marginBottom: '16px'}}
            onChange={handleClick}
            value={commentValue}
            placeholder='댓글을 작성해 주세요'
          />
          <br />
          <button style={{width:'20%', height:'52px'}}>댓글등록</button>
        </form>
      }
    </div>
  );
};

export default SingleComment;