import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useStore } from 'react-redux';
import { Comment, Avatar, Input, Button } from 'antd';
import SingleComment from './SingleComment';

const ReplyComment = (props: any) => {
  const [childComponentNumber, SetChildComponentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let count = 0;
    props.comments.map((comment: any) => {
      if (comment.responseTo === props.parentCommentId) {
        count++;
      }
    });
    SetChildComponentNumber(count);
  }, [props.comments]);

  const renderComments = (parentCommentId: any) => {
    return props.comments.map((comment: any, index: number) => {
      return (
        <React.Fragment>
          { comment.responseTo === parentCommentId &&
            <div key={index} style={{width: '80%', marginLeft: '40px'}}>
              <SingleComment refresh={props.refresh} comment={comment} videoId={props.videoId} />
              <ReplyComment refresh={props.refresh} parentCommentId={comment._id} comments={props.comments} videoId={props.videoId} />
            </div>
          }
        </React.Fragment>
      )
    });
  };

  const onHandleChange = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <div>
      { childComponentNumber > 0 &&
        <p style={{fontSize: '14px', margin: 0, color: 'gray'}} onClick={onHandleChange}>
          {childComponentNumber}개의 댓글이 있습니다.
        </p>
      }

      { openReplyComments &&
        renderComments(props.parentCommentId)
      }
    </div>
  );
};

export default ReplyComment;