const express = require('express');
const app = express();
const port = 8080;


// Example data (based on your description)
const data = {
  text: "Sample text for the frontend",
  links: ["http://example.com", "http://example.org"],
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." // Replace this with your base64 image string
};

// To get data:

  // 1 - each one indidividually from this file:
app.get('/data', (req, res) => {
  res.json(data);
});

  // 2 - all at once from routes instead:
app.use('/hannah', require('./routes'));

app.use(express.static('frontend'));

// Start the server
app.listen(process.env.port || port);
console.log(`Server is running on http://localhost:${port}`);
