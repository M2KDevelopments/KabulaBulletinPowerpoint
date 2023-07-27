
const router = require('express').Router();
const Controller = require('../controllers/vop');

// API - domain.com/api/vop
router.get('/', Controller.get);

// API - domain.com/api/vop/:number
router.get('/:number', Controller.getGuide);

// API - domain.com/api/vop
router.post('/', Controller.post);

router.post('/convert', Controller.convert);

module.exports = router;