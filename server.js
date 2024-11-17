const express = require('express');
const app = express();
const port = 8080;
const db = require('./data/database');

//Middleware
app.use(express.json());

db.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    // Start the server only after the database is initialized
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// Set up routes
app.use('/', require('./routes'));

// filler for homepage
app.get('/', (req, res) => {
  // #swagger.tags = ['Hello World']
  res.send('<h1>Welcome to the Contacts API</h1><p>Use /contacts to interact with the API.</p>');
});


// To get data:

// 1 - frontend files:
  //app.use(express.static('frontend'));

  // 2 - through routes:
  //app.use('/', require('./routes'));

// Start the server
//app.listen(process.env.port || port);
//console.log(`Server is running on http://localhost:${port}`);
