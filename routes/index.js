const router = require('express').Router();
//const lesson1Controller = require('../controllers/lesson1');


//routes.get('/hannah', lesson1Controller.hannahRoute);
router.use('/contacts', require('./contacts'))


module.exports = router;
