const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Simulated user database with users and their respective RFIDs and quotas
const users = {
  user1: { name: 'User One', rfid: 'rfid_123', password: 'password1', remaining_quota: 100 },
  user2: { name: 'User Two', rfid: 'rfid_456', password: 'password2', remaining_quota: 50 }
};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the "public" folder
app.use(session({
  secret: 'secret_key', 
  resave: false, 
  saveUninitialized: true
}));

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username exists and password matches
  if (users[username] && users[username].password === password) {
    // Save the username and RFID in the session
    req.session.user = { username, rfid: users[username].rfid };
    res.json({ success: true });
  } else {
    // Invalid login
    res.json({ success: false, error: 'Invalid username or password' });
  }
});

// Logout API
app.post('/logout', (req, res) => {
  req.session.destroy();  // Destroy the session on logout
  res.json({ success: true });
});

// API to fetch the user's quota (restricted to the logged-in user's RFID)
app.post('/get-quota', (req, res) => {
  const { rfid } = req.body;

  if (req.session.user) {
    // Check if the RFID entered matches the logged-in user's RFID
    if (rfid === req.session.user.rfid) {
      const user = users[req.session.user.username];  // Get the user's data based on session

      // Respond with the user's name and remaining quota
      res.json({ name: user.name, remaining_quota: user.remaining_quota });
    } else {
      // Forbidden access if RFID doesn't match
      res.status(403).json({ error: 'You are not authorized to check this RFID quota' });
    }
  } else {
    // User is not logged in
    res.status(401).json({ error: 'Please log in first' });
  }
});

// Start server and listen on port 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
