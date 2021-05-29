import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

interface IDisLike {
  userId: string,
  commentId: string,
  videoId: string,
};

interface IDisLikeDocument extends IDisLike, Document {

};

interface IDisLikeModel extends Model<IDisLikeDocument> {

};

const DisLikeSchema: Schema<IDisLikeDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }

}, {timestamps: true});

const DisLike = mongoose.model<IDisLikeDocument, IDisLikeModel>('DisLike', DisLikeSchema);
export default DisLike;
