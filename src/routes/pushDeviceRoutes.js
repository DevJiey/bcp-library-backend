const express = require('express');
const authenticate = require('../middlewares/authenticate');
const { register, unregister } = require('../controllers/PushDeviceController');
const router = express.Router();
router.post('/push-devices/register', authenticate, register);
router.post('/push-devices/unregister', authenticate, unregister);
module.exports = router;
