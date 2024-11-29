import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  // Getting the username, email and password from the request body
  const { username, email, password } = req.body;
  try {
    // Hash the password

    const hashedPassword = bcryptjs.hashSync(password, 10);
    // Create new user object

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // and saving it on the database.

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    // Check for duplicate key error (username or email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    next(error);
  }
};

// This is a placeholder, we will implement the signin logic later.
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('Attempting signin with email:', email); // Debug log
  
  try {
    const validUser = await User.findOne({ email });
    console.log('Database query result:', validUser); // Debug log
    
    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong credentials",
      });
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: rest,
      });

  } catch (error) {
    next(error);
  }
};

// This is a placeholder, we will implement the signout logic later.

export const signout = (req, res) => {
  // This is a placeholder, we will implement the signout logic later.
  res.send("Auth");
};
