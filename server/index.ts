import * as express from "express";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
// app.use('/api/video', require('./routes/video'));
// app.use('/api/subscribe', require('./routes/subscribe'));
// app.use('/api/comment', require('./routes/comment'));
// app.use('/api/like', require('./routes/like'));

app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});