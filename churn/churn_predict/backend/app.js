const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes and all origins
app.use(cors());

// Alternatively, you can configure it to allow only specific origins:
// app.use(cors({ origin: 'http://localhost:3000' }));

// Your existing routes
app.post('/train', (req, res) => {
  // Your code for training the model
  res.send("Model trained");
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
