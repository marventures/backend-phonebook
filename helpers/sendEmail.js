import nodemailer from 'nodemailer';
import 'dotenv/config';

const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

/**
 * Sends an email using nodemailer with the configured Gmail SMTP transport.
 *
 * @param {Object} data - The email data.
 * @param {string} data.to - The recipient email address.
 * @param {string} data.subject - The subject of the email.
 * @param {string} data.text - The plain text body of the email.
 * @param {string} [data.html] - The HTML body of the email (optional).
 * @returns {Promise<void>} A promise that resolves with no value when the email is sent successfully.
 * @throws {Error} Will throw an error if there is a problem sending the email.
 */
const sendEmail = async data => {
  const email = { ...data, from: GMAIL_EMAIL };
  await transport.sendMail(email);
};

export { sendEmail };
