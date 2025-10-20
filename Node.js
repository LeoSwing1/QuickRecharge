// Backend Logic: Trackin Dealer Portal Node.js Server with Express
// NOTE: This server uses MOCK data. Use HASHING (bcrypt), a Database, and a real OTP service for production.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const port = 3000;

// Middleware Setup
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files for the front-end

// --- MOCK USER AND OTP DATA ---
const users = [
    { email: 'test7777@gmail.com', passwordHash: '123456789', currentOTP: null, name: 'Trackin Dealer' }
];

// MOCK OTP GENERATOR (Always returns 123456 for testing)
const generateAndSendOTP = (email) => {
    const otp = '123456'; 
    
    const user = users.find(u => u.email === email);
    if (user) {
        user.currentOTP = otp;
        console.log(`[SERVER LOG] Trackin Dealer OTP for ${email}: ${otp}`); 
        return true;
    }
    return false;
};

// ----------------------------------------------------
// API ENDPOINTS FOR AUTHENTICATION FLOW
// ----------------------------------------------------

// POST /api/login: Checks credentials and initiates OTP
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.passwordHash === password);

    if (user) {
        if (generateAndSendOTP(email)) {
            // Success: Instruct client to open OTP modal
            return res.json({ success: true, message: 'OTP sent successfully to your registered email.' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to generate secure OTP. Contact support.' });
        }
    } else {
        // Failure
        return res.status(401).json({ success: false, message: 'Invalid Dealer ID or Password.' });
    }
});

// POST /api/verify-otp: Handles OTP verification
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    const user = users.find(u => u.email === email);

    if (user && user.currentOTP === otp) {
        // Success: OTP Correct. Clear OTP and establish a secure session (JWT)
        user.currentOTP = null; 
        
        // **REAL-WORLD ACTION: Generate and send a JWT token here**
        
        return res.json({ success: true, message: 'Login successful. Welcome to the Trackin Portal.', userName: user.name });
    } else {
        // Failure
        return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Trackin Dealer Portal Backend running at http://localhost:${port}`);
    console.log("To run the frontend, open index.html in your browser or serve it via this Node server.");
});