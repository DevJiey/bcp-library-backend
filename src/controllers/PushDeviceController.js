const asyncHandler = require('../middlewares/asyncHandler');
const {
  registerDevice,
  unregisterDevice,
} = require('../repositories/PushDeviceRepository');

function validToken(token) {
  return typeof token === 'string' &&
    token.length >= 20 && token.length <= 4096 &&
    !/\s/.test(token);
}

const register = asyncHandler(async (req, res) => {
  const { token, platform } = req.body || {};
  if (!validToken(token) || !['android', 'ios'].includes(platform)) {
    return res.status(400).json({ success: false, message: 'Valid device token and platform are required.' });
  }
  await registerDevice({ userId: req.user.id, token, platform });
  return res.status(200).json({ success: true, message: 'Push device registered.' });
});

const unregister = asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  if (!validToken(token)) {
    return res.status(400).json({ success: false, message: 'Valid device token is required.' });
  }
  await unregisterDevice({ userId: req.user.id, token });
  return res.status(200).json({ success: true, message: 'Push device unregistered.' });
});

module.exports = { register, unregister };
