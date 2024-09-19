import nodemailer from "nodemailer";


async function sendTestEmail(req, res) {
  try {
    // Create a test account using nodemailer
    const testAccount = await nodemailer.createTestAccount();

    // Set up transporter using the Ethereal test SMTP service
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Define the message object
    const message = {
      from: ' <abhishekmehta@.email>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world lets start to develop something with nodejs and express", // plain text body
      html: "<b>Hello world?</b>", // html body
    };

    // Send the email
    const info = await transporter.sendMail(message);

    // Respond with email sending info
    return res.status(201).json({
      message: "You should receive an email",
      info: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error.message);

    // Respond with error message if sending fails
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
}

export {sendTestEmail}
