import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const loginService = (email) => {
  return User.findOne({ email }).select("+password");
};

export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET_JWT,
    { expiresIn: "1d" }
  );
};