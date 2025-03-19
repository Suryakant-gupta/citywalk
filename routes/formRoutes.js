// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const sendEmail = require("../utils/templatemailer")
const axios = require("axios");

// Lead form submission
router.post("/api/lead-form", async (req, res) => {
  try {
    const { name, mobile, email, "g-recaptcha-response": recaptchaToken } = req.body;

    if (!name || !mobile || !email || !recaptchaToken) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Verify reCAPTCHA token
    const recaptchaSecretKey = process.env.SECRET;
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const { data } = await axios.post(recaptchaVerifyUrl, null, {
      params: {
        secret: recaptchaSecretKey,
        response: recaptchaToken,
      },
    });

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" });
    }

    // Email content
    const subject = "New Lead From - Karyan City Walk";
    const htmlContent = `
      <h1>New Lead Registration</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>From Website:</strong> Karyan City Walk</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    const recipients = [
      "sales@globalrealtygroup.in",
      "amit.soam@globalrealtygroup.in",
      "crm@globalrealtygroup.in",
    ];
    await sendEmail(recipients, htmlContent, subject);

    req.flash("success", "Thank you for your interest. We will get back to you shortly.");
    res.redirect("/");
  } catch (error) {
    console.error("Lead form submission error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit form", error: error.message });
  }
});


// Price breakup form submission
router.post('/api/download-broachur', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const subject = 'New Lead From - Karyan City Walk';
    const htmlContent = `
      <h1>New Lead</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>From Website:</strong> Karyan City walk</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    // const receipents = ['suryakantgupta678@gmail.com', 'bgmilelomujhse@gmail.com'];
    const receipents = ['sales@globalrealtygroup.in', 'amit.soam@globalrealtygroup.in', 'crm@globalrealtygroup.in'];
    
    const result = await sendEmail(receipents, htmlContent, subject);
    // req.flash('success', 'Thank you for your response. Now you can download the brochure.');

    // Redirect to the brochure PDF instead of just sending "submitted"
    res.redirect('/images/kcB.pdf');
  } catch (error) {
    console.error('Price breakup form submission error:', error);
    // Return HTML error message instead of JSON for direct form submission
    res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <script>
            alert('Failed to submit form. Please try again.');
            window.location.href = '/';
          </script>
        </head>
        <body>
          <p>Redirecting...</p>
        </body>
      </html>
    `);
  }
});



module.exports = router;