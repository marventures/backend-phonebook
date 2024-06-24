import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import 'dotenv/config';
import { User } from '../models/usersModel.js';
// prettier-ignore
import { signupValidation, loginValidation, subscriptionValidation, profileValidation } from "../validations/validation.js";
import { httpError } from '../helpers/httpError.js';

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  //  Registration validation error
  const { error } = signupValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Registration conflict error
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, 'Email in Use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a link to the user's avatar with gravatar
  const avatarURL = gravatar.url(email, { protocol: 'https' });

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    avatarURL,
  });

  // Registration success response
  res.status(201).json({
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //  Login validation error
  const { error } = loginValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Login auth error (email)
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, 'Email or password is wrong');
  }

  // Login auth error (password)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw httpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });

  //   Login success response
  res.status(200).json({
    token: token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;

  // Logout unauthorized error (setting token to empty string will remove token -> will logout)
  await User.findByIdAndUpdate(_id, { token: '' });

  //   Logout success response
  res.status(204).send();
};

const getCurrentUsers = async (req, res) => {
  const { firstName, lastName, email, subscription } = req.user;

  res.json({
    user: {
      firstName,
      lastName,
      email,
      subscription,
    },
  });
};

const updateUser = async (req, res) => {
  const { error } = profileValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const { _id, email: currentEmail } = req.user;
  const { email } = req.body;

  // Update conflict error
  if (email !== currentEmail) {
    const user = await User.findOne({ email });
    if (user) {
      throw httpError(409, 'Email in Use');
    }
  }

  let avatarURL = req.user.avatarURL; // Default to current avatar URL

  // Handle avatar update if a new file is uploaded
  if (req.file) {
    const { path: oldPath, originalname } = req.file;

    await Jimp.read(oldPath).then(image => image.cover(250, 250).write(oldPath));

    const extension = path.extname(originalname);
    const filename = `${_id}${extension}`;

    const newPath = path.join('public', 'avatars', filename);
    await fs.rename(oldPath, newPath);

    avatarURL = path.join('/avatars', filename);
    avatarURL = avatarURL.replace(/\\/g, '/');
  }

  // Update user information
  const updatedUser = await User.findByIdAndUpdate(_id, { ...req.body, avatarURL }, { new: true });

  res.json({
    user: {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL, // Return updated avatarURL if it was updated
    },
  });
};

const updateUserSubscription = async (req, res) => {
  const { error } = subscriptionValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.json({
    user: {
      subscription: updatedUser.subscription,
    },
  });
};

// prettier-ignore
export { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription,  updateUser };
