const router = require('express').Router();

router.use('/contacts', require('./contacts'));
router.use('/', require('./swagger'));

module.exports = router;
