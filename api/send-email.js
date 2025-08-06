const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (req, res) => {
    console.log('Function invoked'); // Log when the function starts

    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({
            success: false,
            message: 'Only POST requests are allowed'
        });
    }

    console.log('Request body:', req.body);

    // Check if environment variables are loaded
    console.log('GMAIL_USER loaded:', !!process.env.GMAIL_USER);
    console.log('GMAIL_PASS loaded:', !!process.env.GMAIL_PASS);

    const {
        name,
        phone,
        email,
        message
    } = req.body;

    if (!name || !email || !message) {
        console.log('Validation failed: Missing form fields');
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: name, email, message'
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        console.log('Attempting to send email...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.status(200).json({
            success: true,
            message: 'Email sent successfully!'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};