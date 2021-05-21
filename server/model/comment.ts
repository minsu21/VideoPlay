import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

interface IComment {
  writer: string,
  videoId: string,
  responseTo: string,
  content: string,
};

interface ICommentDocument extends IComment, Document {

};

interface ICommentModel extends Model<ICommentDocument> {

};

const commentSchema: Schema<ICommentDocument> = new Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video'
  },
  responseTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
  }

}, {timestamps: true});

const Comment = mongoose.model<ICommentDocument, ICommentModel>('Comment', commentSchema);
export default Comment;
