import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import 'dotenv/config';
import { User } from '../models/usersModel.js';
// prettier-ignore
import { signupValidation, loginValidation, subscriptionValidation, profileValidation, emailValidation } from "../validations/validation.js";
import { httpError } from '../helpers/httpError.js';
import { setCookie, removeCookie } from '../helpers/cookie.js';
import { sendEmail } from '../helpers/sendEmail.js';
import { v4 as uuid4 } from 'uuid';

const { SECRET_KEY, BASE_URL } = process.env;

/**
 * Handles user signup by validating input, checking for existing users,
 * hashing the password, creating a new user, and returning a success response.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if validation fails or if the email is already in use.
 */

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

  // Create a verificationToken for the user
  const verificationToken = uuid4();

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // Send an email to the user's mail and specify a link to verify the email (/users/verify/:verificationToken) in the message
  await sendEmail({
    to: email,
    subject: 'Action Required: Verify Your Email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
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

/**
 * Handles user login by validating input, checking user credentials,
 * generating a JWT token, setting it as a cookie, and returning a success response.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if validation fails or if the email or password is incorrect.
 */
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

  // Set JWT token as a cookie
  await User.findByIdAndUpdate(user._id, { token });
  setCookie(res, 'jwt_token', token);

  //   Login success response
  res.status(200).json({
    token: token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
      verify: user.verify,
    },
  });
};

/**
 * Handles user logout by clearing the JWT token and removing the token cookie.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The authenticated user.
 * @param {string} req.user._id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const logoutUser = async (req, res) => {
  const { _id } = req.user;

  // Clear JWT token cookie on logout
  await User.findByIdAndUpdate(_id, { token: null });
  removeCookie(res, 'jwt_token');

  //   Logout success response
  res.status(204).send();
};

const getCurrentUsers = async (req, res) => {
  const { avatarURL, firstName, lastName, email, subscription, verify } = req.user;

  res.json({
    user: {
      firstName,
      lastName,
      email,
      subscription,
      avatarURL,
      verify,
    },
  });
};

/**
 * Updates the authenticated user's profile information, including handling avatar updates.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user profile information.
 * @param {Object} req.user - The authenticated user.
 * @param {string} req.user._id - The ID of the user.
 * @param {string} req.user.email - The current email of the user.
 * @param {string} [req.file] - The uploaded file for the new avatar (optional).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if validation fails or if the email is already in use.
 */
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

    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');

    const extension = path.extname(originalname);
    const filename = `${timestamp}-${randomString}${extension}`;

    const newPath = path.join('public', 'avatars', filename);
    await fs.rename(oldPath, newPath);

    avatarURL = path.join('/avatars', filename);
    avatarURL = avatarURL.replace(/\\/g, '/');
  }

  const verificationToken = uuid4();

  await sendEmail({
    to: email,
    subject: 'Action Required: Verify Your Email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  });

  // Update user information
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { ...req.body, avatarURL, verificationToken, verify: false },
    { new: true }
  );

  res.json({
    user: {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
      verificationToken,
      verify: false,
    },
  });
};

/**
 * Updates the authenticated user's subscription status.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the new subscription status.
 * @param {Object} req.user - The authenticated user.
 * @param {string} req.user._id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if validation fails.
 */
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

/**
 * Handles email verification based on the verification token in the request parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.verificationToken - The verification token associated with the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if the user with the verification token is not found.
 */
const getEmailVerification = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  // Verification user Not Found
  if (!user) {
    throw httpError(400, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  // Verification success response
  res.json({
    message: 'Verification successful',
  });
};

/**
 * Resends the email verification link to the provided email address if the user exists and is not already verified.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the email address.
 * @param {string} req.body.email - The email address to which the verification email should be sent.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if the email validation fails, the user is not found, or the email is already verified.
 */
const resendEmailVerification = async (req, res) => {
  const { email } = req.body;

  // Resending a email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, 'The provided email address could not be found');
  }

  // Resend email for verified user
  if (user.verify) {
    throw httpError(400, 'The email is already verified.');
  }

  await sendEmail({
    to: email,
    subject: 'Action Required: Verify Your Email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  });

  // Resending a email success response
  res.json({ message: 'Verification email sent' });
};

// prettier-ignore
export { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription,  updateUser, getEmailVerification, resendEmailVerification};
