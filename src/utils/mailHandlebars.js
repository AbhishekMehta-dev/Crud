import nodemailer from "nodemailer";
import { readFile as readFileAsync } from 'fs/promises';


const sendGmail = async (req, res) => {
  try {
    const htmlTemplate = await readFileAsync('public/temp/email.handlebars', 'utf-8');
 
    const { from,to,subject,message } = req.body;

    // Create a transporter object using the Gmail SMTP service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address from environment variables
        pass: process.env.GMAIL_PASSWORD, // Your Gmail password from environment variables
      },
    });

    // Define the email options
    const transMessage = {
      from: process.env.GMAIL_USER, // Sender email address
      to: to, // Receiver email address from request body
      subject: subject, // Email subject
      html: htmlTemplate,

    };
    

    // Send the email
    const info = await transporter.sendMail(transMessage);

    // Respond with success message and info
    return res.status(201).json({
      message: "Email sent successfully!",
      info: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);

    // Respond with error message if sending fails
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

export { sendGmail };
