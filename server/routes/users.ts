// import * as express  from 'express';
// // import { auth } from '../middleware/auth';
// import User from '../model/user';

// export const users = () => {
//   const router = express.Router();

//   router.get("/auth", auth, (req: any, res) => {
//     res.status(200).json({
//         _id: req.user._id,
//         isAdmin: req.user.role === 0 ? false : true,
//         isAuth: true,
//         email: req.user.email,
//         name: req.user.name,
//         lastname: req.user.lastname,
//         role: req.user.role,
//         image: req.user.image,
//     });
//   });

//   router.get("/register", (req, res) => {
//     res.send('hello');

//     // const user = new User(req.body);

//     // user.save((err, doc) => {
//     //   if (err) return res.json({ success: false, err });
//     //   return res.status(200).json({
//     //     success: true
//     //   });
//     // });
//   });

//   router.post("/register", (req, res) => {
//     const user = new User(req.body);

//     user.save((err, doc) => {
//       if (err) return res.json({ success: false, err });
//       return res.status(200).json({
//         success: true
//       });
//     });
//   });

//   router.post("/login", (req, res) => {
//     User.findOne({ email: req.body.email }, (err, user) => {
//       if (!user)
//         return res.json({
//           loginSuccess: false,
//           message: "Auth failed, email not found"
//         });

//       user.comparePassword(req.body.password, (err, isMatch) => {
//         if (!isMatch)
//           return res.json({ loginSuccess: false, message: "Wrong password" });

//         user.generateToken((err, user) => {
//           if (err) return res.status(400).send(err);
//           res.cookie("w_authExp", user.tokenExp);
//           res
//             .cookie("w_auth", user.token)
//             .status(200)
//             .json({
//                 loginSuccess: true, userId: user._id
//             });
//         });
//       });
//     });
//   });

//   router.get("/logout", auth, (req: any, res) => {
//     User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, {new: true}, (err, doc) => {
//       if (err) return res.json({ success: false, err });
//         return res.status(200).send({
//             success: true
//         });
//     });
//   });

// };