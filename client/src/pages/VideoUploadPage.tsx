import react, { useState, useCallback } from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const VideoUploadPage = () => {
  const { TextArea } = Input;
  const { Title } = Typography;
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [_private, setPrivate] = useState(0);
  const [category, setCategory] = useState('일상');

  const privates = [
    {value: 0, label: '비공개'},
    {value: 1, label: '모두공개'},
  ];
  const categorys = [
    {value: 0, label: '일상'},
    {value: 1, label: '자동차'},
    {value: 2, label: '음악'},
    {value: 3, label: '애완동물'},
    {value: 4, label: '여행'}
  ];
  
  const onDrop = useCallback( async (files: any) => {
    const formData = new FormData;
    const config = {
      headers: {'content-type': 'multipart/form-data'}
    }
    formData.append('file', files[0]);

    await axios.post("/api/video/upload", formData, config).then((response) => {
      if (response.data.success) {
        console.log('upload', response.data);
      } else {
        alert('파일 업로드를 실패했습니다.');
      }
    });
  }, []);

  return (
    <div style={{maxWidth: '700px', margin: '2rem auto'}}>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <Title level={2}>Upload</Title>
      </div>
      <Form>
        <div style={{display:'flex', justifyContent: 'space-between'}}>
          <Dropzone 
            onDrop={onDrop}
            multiple={false}
            maxSize={1024 * 1024}>
            {({getRootProps, getInputProps}) => (
              <div style={{width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <PlusOutlined style={{fontSize: '3rem', color: 'gray'}} />
              </div>
            )}
          </Dropzone>
          <div>
            <img></img>
          </div>
        </div>
      </Form>
      <br />
      <br />
      <label>제목</label>
      <Input
        value={videoTitle}
        onChange={(event) => {setVideoTitle(event.currentTarget.value)}}
      />
      <br />
      <br />
      <label>설명</label>
      <TextArea
        value={description}
        onChange={(event) => {setDescription(event.currentTarget.value)}}
      />
      <br />
      <br />
      <select onChange={(event) => {setPrivate(Number(event.currentTarget.value))}}>
      {
        privates.map((item, index) => {
          return <option key={index} value={item.value}>{item.label}</option>
        })
      }
      </select>
      <br />
      <br />
      <select onChange={(event) => {setCategory(event.currentTarget.value)}}>
      {
        categorys.map((item, index) => {
          return <option key={index} value={item.value}>{item.label}</option>
        })
      }
      </select>
      <br />
      <br />
      <Button type='primary' size='large'>Primary Button</Button>

    </div>
  );

};

export default VideoUploadPage;