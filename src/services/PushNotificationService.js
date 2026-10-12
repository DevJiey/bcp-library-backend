const pool = require("../config/database");
const { getFirebaseMessaging } = require("../config/firebaseAdmin");

// Best-effort delivery after a completed business operation.
// Never log full device tokens or Firebase credentials.
async function sendPushToUser({ userId, title, body }) {
    const result = await pool.query(
        "SELECT token FROM push_device_tokens WHERE user_id = $1 AND platform = 'android'",
        [userId]
    );
    if (result.rowCount === 0) return { sent: 0, failed: 0 };

    const messaging = getFirebaseMessaging();
    let sent = 0;
    let failed = 0;
    for (const { token } of result.rows) {
        try {
            await messaging.send({
                token,
                notification: { title, body },
                android: { priority: "high" },
            });
            sent++;
        } catch (error) {
            failed++;
            const code = error.code || "unknown";
            console.error("FCM send failed:", code);
            if ([
                "messaging/registration-token-not-registered",
                "messaging/invalid-registration-token",
            ].includes(code)) {
                await pool.query(
                    "DELETE FROM push_device_tokens WHERE user_id = $1 AND token = $2",
                    [userId, token]
                ).catch(err => console.error("FCM token cleanup failed:", err.message));
            }
        }
    }
    return { sent, failed };
}

module.exports = { sendPushToUser };
