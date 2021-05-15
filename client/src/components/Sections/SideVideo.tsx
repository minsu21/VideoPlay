import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SideVideo = () => {
  const [video, setVideo] = useState([]);
  
  useEffect(() => {
    axios.get('/api/video/list').then(response => {
      console.log('/api/video/list', response);
      if (response.data.success) {
        setVideo(response.data.videos);
      } else {
        alert('영상 목록을 가져오지 못했습니다.');
      }
    });
  }, []);

  const renderSide = video.map((data: any, index) => {
    const minutes = Math.floor(data.duration / 60);
    const seconds = Math.floor(data.duration - minutes * 60);

    return (
      <div key={index} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem'}}>
        <div style={{width: '40%', marginRight: '1rem'}}>
          <a href={`/video/${data._id}`}>
            <img style={{width: '100%', height: '100%'}} src={`http://localhost:8000/${data.thumbnail}`} alt='thumbnail' />
          </a>
        </div>

        <div style={{width: '50%'}}>
          <a style={{color: 'gray'}} href='#'>
            <div style={{fontSize: '1rem', color: 'black'}}>{data.title}</div>
            <div>{data.writer.name}</div>
            <div>{data.views}</div>
            <div>{minutes} : {seconds}</div>
          </a>
        </div>

      </div>
    )
  });

  return (
    <React.Fragment>
      <div style={{marginTop: '3rem'}} />
      {renderSide}
    </React.Fragment>
  )
};

export default SideVideo;