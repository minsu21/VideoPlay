import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

interface IUser {
  name: string,
  email: string,
  password: string,
  role: number,
  image: string,
  token: string,
  tokenExp: string,
};

interface IUserDocument extends IUser, Document {
  comparePassword(password: string, next: (err: Error | null, same: boolean | null) => void): void,
  generateToken(next: (err: Error, userInfo: IUser) => void),
};

interface IUserModel extends Model<IUserDocument> {
  findByToken(token: {}, next: (err: Error, userInfo: IUser) => void),
};

const saltRounds = 10;
const userSchema: Schema<IUserDocument> = new Schema({
  name: {
    type:String,
    maxlength: 50
  },
  email: {
    type:String,
    trim: true,
    unique: 1 
  },
  password: {
    type: String,
    minglength: 5
  },
  role : {
    type: Number,
    default: 0 
  },
  image: String,
  token : {
    type: String,
  },
  tokenExp :{
    type: Number
  }
});

userSchema.pre<IUserDocument>('save', function(this: IUserDocument, next: NextFunction) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err: Error, salt: string) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err: Error, hash: string) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  };
});

userSchema.methods.comparePassword = function(this: IUserDocument, password, next) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch)
  });
};

userSchema.methods.generateToken = function(this: IUserDocument, next) {
  const user = this;
  const token = sign(user._id.toHexString(), 'jwt');

  user.token = token;
  user.save(function(err, user) {
    if (err) return next(err);
    next(null, user);
  });
};

userSchema.statics.findByToken = function(token, next) {
  const user = this;

  verify(token, 'jwt', function(err, decoded) {
    user.findOne({'_id': decoded, 'token': token}, function (err, user) {
      if (err) return next(err);
      next(null, user);
    });
  });
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
