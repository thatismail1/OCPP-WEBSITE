const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Example user database
const users = {
  'rfid_123': { name: 'User 1', remaining_quota: 35 },
  'rfid_456': { name: 'User 2', remaining_quota: 10 }
};

// API to fetch user quota based on RFID
app.get('/get-quota', (req, res) => {
  const rfid = req.query.rfid;

  if (users[rfid]) {
    res.json({ name: users[rfid].name, remaining_quota: users[rfid].remaining_quota });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('OCPP CMS backend running on port 3000');
});
