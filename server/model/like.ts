import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

interface ILike {
  userId: string,
  commentId: string,
  videoId: string,
};

interface ILikeDocument extends ILike, Document {

};

interface ILikeModel extends Model<ILikeDocument> {

};

const LikeSchema: Schema<ILikeDocument> = new Schema({
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

const Like = mongoose.model<ILikeDocument, ILikeModel>('Like', LikeSchema);
export default Like;
