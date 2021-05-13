import react from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import Icon from '@ant-design/icons';

const VideoUploadPage = () => {

  const { TextArea } = Input;
  const { Title } = Typography;

  return (
    <div style={{maxWidth: '700px', margin: '2rem auto'}}>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <Title level={2}>Upload</Title>
      </div>
      <Form>
        <div style={{display:'flex', justifyContent: 'space-between'}}>
          <div>
            <img></img>
          </div>
        </div>
      </Form>
      <br />
      <br />
      <label>Title</label>
      <Input></Input>
      <br />
      <br />
      <label>Description</label>
      <Input></Input>
      <TextArea></TextArea>
      <br />
      <br />
      <select onChange={() => null}>
        <option></option>
      </select>
      <br />
      <br />
      <select onChange={() => null}>
        <option></option>
      </select>
      <br />
      <br />
      <Button type='primary' size='large'>Primary Button</Button>

    </div>
  );

};

export default VideoUploadPage;