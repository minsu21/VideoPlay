import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';

interface ISubscriber {
  name: string,
  email: string,
  password: string,
  role: number,
  image: string,
  token: string,
  tokenExp: string,
};

interface ISubscriberDocument extends ISubscriber, Document {

};

interface ISubscriberModel extends Model<ISubscriberDocument> {

};

const subscriberSchema: Schema<ISubscriberDocument> = new Schema({
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

}, {timestamps: true});

const Subscriber = mongoose.model<ISubscriberDocument, ISubscriberModel>('Subscriber', subscriberSchema);
export default Subscriber;
