const express = require('express');
const app = express();
const port = 8080;

// To get data:
  
// 1 - frontend files:
  app.use(express.static('frontend'));

  // 2 - through routes:
  app.use('/', require('./routes'));


// Start the server
app.listen(process.env.port || port);
console.log(`Server is running on http://localhost:${port}`);
