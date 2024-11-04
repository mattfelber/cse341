const express = require('express');
const app = express();
const port = 8080;
const db = require('./data/database');

app.use(express.json()); // Make sure JSON middleware is set

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

// Set up routes
app.use('/', require('./routes'));

//w01

//W01 contacts end

// To get data:
  
// 1 - frontend files:
  //app.use(express.static('frontend'));

  // 2 - through routes:
  //app.use('/', require('./routes'));


// Start the server
//app.listen(process.env.port || port);
//console.log(`Server is running on http://localhost:${port}`);
