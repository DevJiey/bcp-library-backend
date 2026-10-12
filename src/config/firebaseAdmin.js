
const fs = require("node:fs");
const {
  initializeApp,
  getApps,
  getApp,
  cert,
} = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  let serviceAccount;

  // Production: Firebase credentials from Vercel environment variable
  const serviceAccountBase64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  // Local development: Firebase credentials from local JSON file
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  try {
    if (serviceAccountBase64) {
      const decoded = Buffer.from(
        serviceAccountBase64,
        "base64"
      ).toString("utf8");

      serviceAccount = JSON.parse(decoded);
    } else if (filePath) {
      serviceAccount = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );
    } else {
      throw new Error("Firebase credentials are not configured");
    }
  } catch {
    throw new Error(
      "Unable to load Firebase service account credentials"
    );
  }

  if (
    !serviceAccount.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    throw new Error(
      "Firebase service account is missing required fields"
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

function getFirebaseMessaging() {
  return getMessaging(getFirebaseAdmin());
}

module.exports = {
  getFirebaseAdmin,
  getFirebaseMessaging,
};
