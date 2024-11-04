const User = require("../models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: ""
  }
});

const getOneUser = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const signup = async (req, res, next) => {
  const { lastName, firstName, login, city, password, email } = req.body;

  try {
    const searchUser = await User.find({ email });
    if (searchUser.length >= 1) {
      return res.status(409).json({
        message: "this email exist"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }

  if (!password.match(regex))
    return res.status(400).json({ message: "Password is weak" });

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        lastName,
        firstName,
        login,
        city,
        password: hash,
        email
      });
      try {
        await user.save();
        await User.findOne({ email }, function (err, result) {
          if (err) throw err;
          var mailOptions = {
            from: "booksswap123@gmail.com",
            to: result.email,
            subject: "Activation link !",
            html:
              "<h1>Link : https://8sn9q.csb.app/enable/" +
              result.login +
              "</h1>"
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + result.email);
            }
          });
        });
        res.status(201).json({ message: "created user" });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    }
  });
};

const login = async (req, res, next) => {
  try {
    const user = await User.find().or([
      { email: req.body.login },
      { login: req.body.login }
    ]);
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      } else if (user[0].isEnable === false) {
        return res.status(401).json({
          message: "Account Disabled"
        });
      } else {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          "f8becfafde96551661521b24579dad51dfc7c98ecf0f8fce96fea283eb968d9c3f2a31be3baf42e67d1519d83209a2f66550014f75aae9411acaf35246a7c94c",
          {
            expiresIn: "1h"
          }
        );
        return res.status(200).json({
          result: user[0],
          token: token
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const setting = async (req, res) => {
  const { lastName, firstName, login, city, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser)
      return res.status(400).json({ message: "User doesn't exist" });
    else {
      const hashedPassword = await bcrypt.hash(password, 12);

      if (oldUser.password !== password) oldUser.password = hashedPassword;
      oldUser.lastName = lastName;
      oldUser.firstName = firstName;
      oldUser.city = city;
      oldUser.login = login;
      oldUser.email = email;
      await oldUser.save();

      res.status(201).json({ message: "Account has been updated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const enable = async (req, res) => {
  const { email, isEnable } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    oldUser.isEnable = isEnable;
    await oldUser.save();

    res.status(201).json({ message: "Account has been updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const disable = async (req, res) => {
  const { login } = req.body;

  try {
    const oldUser = await User.findOne({ login });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    else {
      var Enable = await User.findOne({ login });
      Enable.isEnable = true;
      await Enable.save();
      await User.findOne({ login }, function (err, result) {
        if (err) throw err;
        var mailOptions = {
          from: "booksswap123@gmail.com",
          to: result.email,
          subject: "Account has been activated !",
          html: "<h1>Account has been activated.</h1>"
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + result.email);
          }
        });
      });
      res.status(200).json({ result: "Account has been activated" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getOneUser,
  getAllUsers,
  signup,
  login,
  setting,
  enable,
  disable
};
