const bcrypt = require("bcrypt");
const RegisterModel = require("../models/Register");
const { generateToken } = require("../utils/token");

exports.renderRegister = (req, res) => {
  res.render("register");
};

exports.renderLogin = (req, res) => {
  res.render("login");
};

exports.registerUser = async (req, res, next) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { name, email, password } = req.body;

    // 🔹 1. check duplicate email
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    // 🔹 2. async bcrypt
    const hash = await bcrypt.hash(password, 10);

    const user = await RegisterModel.create({
      name,
      email,
      password: hash
    });

    // 🔹 3. proper JWT payload
    const token = generateToken({
      id: user._id,
      email: user.email
    });

    // 🔹 4. secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false // true in production (https)
    });

   res.status(201).json({       // This is how we send response to frontend
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 🔹 5. explicitly select password
    const user = await RegisterModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    const token = generateToken({
      id: user._id,
      email: user.email
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.status(200).json({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};


exports.logoutUser = (req, res) => {
  res.clearCookie("token");
 res.status(200).json({ success: true });   
};
