const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import API routes
const emailRoutes = require('./api/send-email'); // Assuming send-email.js exports a router

// Use API routes
app.use('/api', emailRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('StyleByDIVYA API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
