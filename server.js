const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve CSS, JS, images, etc.

// --- Mock Wallet Data ---
let walletBalance = 10000; // initial balance

// --- API Routes ---

// Get current balance
app.get('/api/balance', (req, res) => {
    res.json({ balance: walletBalance });
});

// Add money to wallet
app.post('/api/add', (req, res) => {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.json({ error: 'Invalid amount' });
    }
    walletBalance += parseFloat(amount);
    res.json({ balance: walletBalance });
});

// Spend money from wallet
app.post('/api/spend', (req, res) => {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.json({ error: 'Invalid amount' });
    }
    if (amount > walletBalance) {
        return res.json({ error: 'Insufficient balance' });
    }
    walletBalance -= parseFloat(amount);
    res.json({ balance: walletBalance });
});

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
