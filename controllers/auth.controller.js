import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 🎉 SIGNUP: When a new user wants to join our app!
export const Signup = async (req, res, next) => {
  // 📝 Getting user's information from the form they filled out
  const { username, email, password } = req.body;

  try {
    // 🔒 Making the password super secret (like putting it in a special blender)
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // 📚 Creating a new page in our big book of users
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 💾 Saving the new user's info in our big book (database)
    await newUser.save();

    // 👍 Telling the user "Yay! You're registered!"
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    // 🚫 Checking if someone already took that username or email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    next(error);
  }
};

// 🔑 SIGNIN: When a user comes back to visit!
export const Signin = async (req, res, next) => {
  // 📧 Getting the email and password they typed
  const { email, password } = req.body;
  // 🔍 Writing down what email we're looking for (for debugging)
  // console.log("Attempting signin with email:", email);

  try {
    // 📖 Looking in our big book to find the user
    const validUser = await User.findOne({ email });
    // console.log("Database query result:", validUser); for debugging purposes

    // 😕 If we can't find their email in our book
    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "User not found 🙉",
      });
    }

    // 🔐 Checking if they gave us the right password
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    // 🚫 If the password is wrong
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong credentials",
      });
    }

    // 🎯 Creating a special bracelet (token) that says they're allowed in
    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // ⏰ Bracelet expires after one day
    );

    // 🙈 Hiding their password before sending their info back
    const { password: pass, ...rest } = validUser._doc;

    // 🎉 Giving them their bracelet and saying welcome back!
    res
      .cookie("access_token", token, {
        httpOnly: true, // 🔒 Makes the cookie extra safe
        secure: process.env.NODE_ENV === "production", // 🔐 Even more security
        sameSite: "strict", // 🛡️ Protects against certain attacks
        maxAge: 24 * 60 * 60 * 1000, // ⏰ Cookie lasts for 1 day
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully 🎉",
        user: rest, // 📋 Sending back their info (without the password)
      });
  } catch (error) {
    next(error); // 🚨 If something goes wrong, tell us about it.
  }
};
// 🛑 SIGNUP: google signin and sign up
export const Google = async (req, res) => {
  try {
    //  get the user info and check if  they already exist in ths database.
    const user = await User.findOne({ email: req.body.email });
    // separate the user password and the rest of the info
    // if the user already exists, update their info.
    if (user) {
      const { password: pass, ...rest } = user._doc;
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      // we send  response with the user info and the token
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, user: rest });
    } else {
      // if the user doesn't exist, create a new user.
      //make a random password  generator
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      //hashedPassword will be the password that will be saved in the database
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      // Creating a new user and save it in the database.
      const newUser = new User({
        username:
          req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photoUrl,
      });
      // saving the new user in the database.
      await newUser.save();
      // sending the token and the user info to the frontend.
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET
      );
      //send the token and the user info to the frontend
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          user: {
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
          },
        });
    }
    // if something goes wrong, log it in the console.
    res.status(500).json({ success: false, message: error.message });
    console.error(error);
  } catch (error) {
    console.log(error.message);
  }
};
// 👋 SIGNOUT: When a user wants to leave
export const Signout = (req, res) => {
  // 🔜 We'll add the logout logic here later!
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Signed out successfully" });
  res.send("Auth");
};
