import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
// import { users } from './routes/users';
import User from './model/user';
import { NativeError } from 'mongoose';
import { auth } from './middleware/auth';

const config = require('./config/key');

const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use('/api/users', users);
// app.use('/api/video', require('./routes/video'));
// app.use('/api/subscribe', require('./routes/subscribe'));
// app.use('/api/comment', require('./routes/comment'));
// app.use('/api/like', require('./routes/like'));
// app.use('/uploads', express.static('uploads'));


app.post('/api/user/register', (req: Request, res: Response) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({success: false, err});
    return res.status(200).json({
      success: true
    });
  });
});

app.post('/api/user/login', (req: Request, res: Response) => {
  
  User.findOne({ email: req.body.email }, (err: NativeError, userInfo) => {
    if (!userInfo) {
      return res.json({
        login: false,
        message: "회원이 아닙니다."
      });
    };

    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ login: false, message: '비밀번호가 올바르지 않습니다.'});
      };

      userInfo.generateToken((err, userInfo) => {
        if (err) return res.status(400).send(err);

        res.cookie('x_auth', userInfo.token).status(200)
        .json({ login: true, userId: userInfo._id });
      });

    });
  });

});

app.get('/api/user/auth', auth, (req: any, res: Response) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});