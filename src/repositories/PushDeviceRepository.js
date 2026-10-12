const pool = require('../config/database');

async function registerDevice({ userId, token, platform }) {
  // A device token is owned by one account at a time. Re-registering after
  // account switching transfers ownership rather than notifying both users.
  await pool.query(
    `INSERT INTO push_device_tokens (user_id, token, platform)
     VALUES ($1, $2, $3)
     ON CONFLICT (token) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       platform = EXCLUDED.platform,
       updated_at = NOW()`,
    [userId, token, platform]
  );
}

async function unregisterDevice({ userId, token }) {
  const result = await pool.query(
    `DELETE FROM push_device_tokens WHERE user_id = $1 AND token = $2`,
    [userId, token]
  );
  return result.rowCount > 0;
}

module.exports = { registerDevice, unregisterDevice };
