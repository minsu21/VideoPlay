import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

interface IVideo {
  name: string,
  email: string,
  password: string,
  role: number,
  image: string,
  token: string,
  tokenExp: string,
};

interface IVideoDocument extends IVideo, Document {

};

interface IVideoModel extends Model<IVideoDocument> {

};

const videoSchema: Schema<IVideoDocument> = new Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    maxlenth: 50,
  },
  description: {
    type: String,
  },
  privacy: {
    type: Number,
  },
  filePath: {
    type: String,
  },
  category: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
  },
  thumbnail: {
    type: String
  }
}, {timestamps: true});

const Video = mongoose.model<IVideoDocument, IVideoModel>('Video', videoSchema);
export default Video;
