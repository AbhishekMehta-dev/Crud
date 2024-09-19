import nodemailer from "nodemailer";


async function sendEmail(req, res) {
  try {
    
    const { userEmail } = req.body;
    
    const transporter = nodemailer.createTransport({
      host: "mail.careassign.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });

    // Define the message object
    const message = {
      from: process.env.SMTP_USER, // sender address
      to: userEmail , // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world lets start to develop something", // plain text body
      
    };

    // Send the email
    const info = await transporter.sendMail(message);

    // Respond with email sending info
    return res.status(201).json({
      message: "You should receive an email",
      info: info.messageId,
    //   preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error.message);

    // Respond with error message if sending fails
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
}

export {sendEmail}
