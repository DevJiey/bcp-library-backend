const pool = require("../config/database");
const AppError = require("../utils/AppError");

async function correctPendingBorrowerEmail(req, res, next) {
  const userId = Number(req.params.id);
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!Number.isSafeInteger(userId) || userId <= 0 || email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError("Valid borrower ID and email are required.", 400));
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await client.query(`
      SELECT id, email FROM users
      WHERE id=$1 AND role='borrower' AND account_status='pending'
      FOR UPDATE
    `, [userId]);
    if (!user.rowCount) throw new AppError("Pending borrower not found.", 404);
    if (user.rows[0].email !== email) {
      const duplicate = await client.query(
        "SELECT id FROM users WHERE LOWER(email)= $1 AND id <> $2 LIMIT 1",
        [email, userId]
      );
      if (duplicate.rowCount) throw new AppError("Email already exists.", 409);
      await client.query("UPDATE users SET email=$1 WHERE id=$2", [email, userId]);
      await client.query(`
        UPDATE borrower_invitations SET revoked_at=NOW()
        WHERE user_id=$1 AND used_at IS NULL AND revoked_at IS NULL
      `, [userId]);
    }
    await client.query("COMMIT");
    return res.status(200).json({ success: true,
      message: "Email updated. Resend invitation to the corrected address." });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    if (err.code === "23505") return next(new AppError("Email already exists.", 409));
    return next(err);
  } finally { client.release(); }
}
module.exports = { correctPendingBorrowerEmail };
