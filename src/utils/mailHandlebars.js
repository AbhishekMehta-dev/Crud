import fs from 'fs';
import { promisify } from 'util';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

// Convert readFile to a promise-based function using promisify
const readFileAsync = promisify(fs.readFile);

export const sendGmailwithHandlebar = async (req, res) => {
  try {
    // Read the Handlebars template file asynchronously
    const htmlTemplate = await readFileAsync('public/temp/email.handlebars', 'utf-8');

    // Destructure email fields from the request body
    const { from, to, subject, message } = req.body;

    // Compile the Handlebars template
    const template = Handlebars.compile(htmlTemplate);

    // Generate the final HTML by injecting the provided data into the template
    const htmlToSend = template({
      from: from || process.env.GMAIL_USER,  // Default 'from' email if not provided
      to: to,
      subject: subject,
      message: message
    });

    // Create a transporter object using Gmail SMTP service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,     // Your Gmail address from environment variables
        pass: process.env.GMAIL_PASSWORD, // Your Gmail password from environment variables
      },
    });

    // Define the email options
    const mailOptions = {
      from: from || process.env.GMAIL_USER, // Sender email address (fallback to environment variable)
      to: to,                               // Receiver email address from request body
      subject: subject,                     // Email subject
      html: htmlToSend,                     // Final HTML rendered from the Handlebars template
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Respond with success message and email info
    return res.status(201).json({
      message: "Email sent successfully!",
      info: info.messageId,
    });

  } catch (error) {
    console.error("Error sending email:", error.message);

    // Respond with error message if the email sending fails
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};
