const nodemailer = require("nodemailer");

// Function to send emails
const sendEmail = async (toEmail, subject, htmlContent, attachment) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ansariafroz720@gmail.com",
        pass: "saab jfnz zfrc qgfx",
      },
    });

    let message = {
      from: '"ChillyNote" <Info@chillynote.com>',
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.verify();

    // Sending email and returning success response
    let info = await transporter.sendMail(message);
    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      message: `Email sent successfully: ${info.messageId}`,
    };
  } catch (error) {
    // console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
};

module.exports = sendEmail;
