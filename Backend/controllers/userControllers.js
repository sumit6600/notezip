const asynchandler = require("express-async-handler");
const User = require("../models/userModals");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const expressJWT = require("express-jwt");
const { errorHandlers } = require("../helpers/dbErrorHandling");

const registerController = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User with this email already Exits");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });

    // await user.hashPassword();
    // await user.save();
  } else {
    res.status(400);
    throw new Error("Error Occured!");
  }
});

const authUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else if (!user) {
    return res.status(401).send({
      msg:
        "The email address " +
        req.body.email +
        " is not associated with any account. please check and try again!",
    });
  } else if (!Bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({ msg: "Wrong Password!" });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const updateUserProfile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      pic: updatedUser.pic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const allUsers = asynchandler(async (req, res) => {
  // to get a data from url(name a search url) we use req.query.search
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerController, authUser, updateUserProfile, allUsers };
