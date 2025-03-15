const nodemailer = require('nodemailer');


const fromUser = "bgmilelomujhse@gmail.com"
const password = "ywhy ioln niwm sxen"


// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: fromUser, 
    pass: password
  }
});

// Function to send email notification
const sendEmail = (recipient, htmlTemplate, subject) => {
  const mailOptions = {
    from: fromUser, 
    to: recipient,
    subject: subject,
    html: htmlTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;