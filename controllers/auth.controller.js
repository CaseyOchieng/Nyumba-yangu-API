import bcrypt from "bcrypt";
import User from "../models/user.model.js";
export const signup = async (req, res) => {
  try {
    // We receive the data from the client in the request body
    const { username, email, password } = req.body;
    // hashed password
    // We hash the password to store it securely in the database
    const hashedPassword = await bcrypt.hash(password, 12);
    //  creating a new user
    const newUser = new User({ username, email, password: { hashedPassword } });
    //  saving the user to the database
    await newUser.save();
    // then we send the user to the client message that the user has been created successfully.
    res.status(201).json("user created successfully");
    // catching any errors.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = (req, res) => {
  // This is a placeholder, we will implement the signin logic later.
  res.send("Auth");
};

export const signout = (req, res) => {
  // This is a placeholder, we will implement the signout logic later.
  res.send("Auth");
};
