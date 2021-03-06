import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { NativeError } from 'mongoose';
import { auth } from './middleware/auth';
import * as path from 'path';

import User from './model/user';
import Video from './model/video';
import Subscriber from './model/subscriber';
import Comment from './model/comment';
import Like from './model/like';
import DisLike from './model/dislike';

const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const config = require('./config/key');
const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'upload/')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      if (ext !== '.mp4') {
          return cb(null, false);
      };
      cb(null, true);
  }
});
const upload = multer({storage: storage}).single('file');

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/upload', express.static('upload'));

app.get('/api/test', (req: Request, res: Response) => res.send('Express Test'));

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
        message: "????????? ????????????."
      });
    };

    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ login: false, message: '??????????????? ???????????? ????????????.'});
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

app.get('/api/user/logout', auth, (req: any, res: Response) => {
  
  User.findOneAndUpdate({ _id: req.user._id}, { token: ''}, {rawResult: true}, (err, user) => {
    if (err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    });
  });

});

app.post('/api/video/upload', (req: any, res: any) => {

  upload(req, res, err => {
    if (err) {
      console.log('upload err', err);
      return res.json({success: false, err});
    }
    console.log('upload', res.req.file.path, res.req.file.filename);

    return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename });
  });

});

app.post('/api/video/thumbnail', (req: any, res: any) => {
  
  // ffmpeg ???????????? https://www.gyan.dev/ffmpeg/builds/;
  let filePath = '';
  let fileDuration = '';

  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir('metadata', metadata);
    console.log('metadata.format.duration', metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  // ????????? ??????
  ffmpeg(req.body.url).on('filenames',  (filenames) => {
    console.log('filenames', filenames);
    filePath = 'upload/thumbnails/' + filenames[0];
  }).on('end', () => {
    return res.json({ success: true, url: filePath, fileDuration: fileDuration});
  }).on('error', (err) => {
    return res.json({success: false, err});
  }).screenshots({
    count: 3,
    folder: 'upload/thumbnails/',
    size: '320x240',
    filename: 'thumbnail-%b.png' 
  });

});

app.post('/api/video/write', (req: any, res: any) => {
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({success: false, err});
    return res.status(200).json({success: true});
  });
});

app.get('/api/video/list', (req: any, res: any) => {
  Video.find().populate('writer').exec((err, videos) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({success: true, videos});
  });
});

app.post('/api/video/detail', (req: any, res: any) => {
  Video.findOne({'_id': req.body.videoId}).populate('writer').exec((err, video) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({success: true, video});
  });
});

app.post('/api/video/subscription', (req: any, res: any) => {
  Subscriber.find({userFrom: req.body.userFrom}).exec((err, subscriberInfo) => {
    if (err) return res.status(400).send(err);

    const subscribedUser = [];
    subscriberInfo.map((data, index) => {
      subscribedUser.push((data as any).userTo);
    });

    Video.find({writer: { $in: subscribedUser }}).populate('writer').exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({success: true, videos});
    });
  });

});

app.post('/api/subscribe/count', (req: any, res: any) => {
  Subscriber.find({'userTo': req.body.userTo}).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({success: true, subscribeCount: subscribe.length});
  });
});

app.post('/api/subscribe/subscribed', (req: any, res: any) => {
  Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom}).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    let result = false;
    if (subscribe.length !== 0) {
      result = true;
    }
    return res.status(200).json({success: true, subscribed: result});
  });
});

app.post('/api/subscribe/unSubscribe', (req: any, res: any) => {
  Subscriber.findOneAndDelete({'userTo': req.body.userTo, 'userFrom': req.body.userFrom}).exec((err, doc) => {
    if (err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true, doc});
  });
});

app.post('/api/subscribe/subscribe', (req: any, res: any) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true});
  });
});

app.post('/api/comment/save', (req: any, res: any) => {
  const comment = new Comment(req.body);
  
  comment.save((err, comment) => {
    if (err) return res.status(400).json({success: false, err});
    Comment.find({'_id': comment._id}).populate('writer').exec((err, result) => {
      if (err) return res.status(400).json({success: false, err});
      return res.status(200).json({success: true, result});
    });
  });
});

app.post('/api/comment/getComments', (req: any, res: any) => {

  Comment.find({'videoId': req.body.videoId}).populate('writer').exec((err, comment) => {
    if (err) return res.status(400).send(err)
    res.status(200).json({ success: true, comment })
  });

});

app.post('/api/like/get', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  };

  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });

});

app.post('/api/like/upLike', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  };

  const like = new Like(variable);

  like.save((err, likeResult) => {
    if (err) return res.status(400).json({success: false, err});

    DisLike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({success: false, err});
      res.status(200).json({success: true});
    });
  });

});

app.post('/api/like/unLike', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  };

  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err});
    res.status(200).json({success: true});
  });
  
});


app.post('/api/dislike/get', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  };

  DisLike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });

});


app.post('/api/like/upDislike', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  };

  const dislike = new DisLike(variable);

  dislike.save((err, dislikeResult) => {
    if (err) return res.status(400).json({success: false, err});

    Like.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({success: false, err});
      res.status(200).json({success: true});
    });
  });

});

app.post('/api/like/unDislike', (req: any, res: any) => {

  let variable = {};

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  };

  DisLike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err});
    res.status(200).json({success: true});
  });
  
});


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});