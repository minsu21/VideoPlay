import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

interface RootState {
  user: any
};

const Comment = (props: any) => {
  const selectUser = (state: RootState) => state.user;
  const user = useSelector(selectUser);
  const videoId = props.videoId;
  const [commentValue, setCommentValue] = useState('');
  const list = props.comments;

  const handleClick = (event: any) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoId: videoId,
    };

    axios.post('/api/comment/save', variables).then(response => {
      if (response.data.success) {
        props.refresh(response.data.result);
        setCommentValue('');
      } else {
        alert('댓글을 저장하지 못했습니다.');
      };
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      { list && 
        list.map((comment: any, index: number) => {
          return (!comment.responseTo &&
            <React.Fragment>
              <SingleComment refresh={props.refresh} key={index} comment={comment} videoId={videoId} />
              <ReplyComment refresh={props.refresh} parentCommentId={comment._id} comments={list} videoId={videoId} />
            </React.Fragment>
          );
        })
      }

      <form style={{display: 'flex'}} onSubmit={onSubmit}>
        <textarea
          style={{width: '100%', borderRadius: '5px'}}
          onChange={handleClick}
          value={commentValue}
          placeholder='댓글을 작성해 주세요'
        />
        <br />
        <button style={{width:'20%', height:'52px'}}>댓글등록</button>
      </form>
    </div>
  )
};

export default Comment;