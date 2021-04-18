import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export interface IUser extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  role: number,
  image: string,
  token: string,
  tokenExp: string,
  comparePassword(password: string, next: (err: Error | null, same: boolean | null) => void): void,
  generateToken(next: (err: Error, userInfo: IUser) => void),
};

const saltRounds = 10;
const userSchema = new mongoose.Schema({
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

userSchema.pre<IUser>('save', function(this: IUser, next: NextFunction) {
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

userSchema.methods.comparePassword = function(this: IUser, password, next) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch)
  });
};

userSchema.methods.generateToken = function(this: IUser, next) {
  const user = this;
  const token = sign(user._id.toHexString(), 'jwt');

  user.token = token;
  user.save(function(err, user) {
    if (err) return next(err);
    next(null, user);
  });

};

export const User = mongoose.model<IUser>('User', userSchema);
