const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const crypto = require("node:crypto");

initializeApp();

const adminPassword = defineSecret("SKYVEIL_ADMIN_PASSWORD");

exports.skyveilAdminLogin = onRequest(
  { secrets: [adminPassword], cors: true, maxInstances: 3 },
  async (req, res) => {
    res.set("Cache-Control", "no-store");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const submitted =
      typeof req.body?.password === "string" ? req.body.password : "";

    const expected = adminPassword.value();
    const a = Buffer.from(submitted);
    const b = Buffer.from(expected);

    const matches =
      a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!matches) {
      return res.status(401).json({ error: "Invalid password" });
    }

    try {
      const uid = "skyveil-site-admin";
      const token = await getAuth().createCustomToken(uid, { admin: true });

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Admin token creation failed", error);
      return res.status(500).json({
        error: "Unable to create admin session"
      });
    }
  }
);
