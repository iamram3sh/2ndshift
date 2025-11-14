// api/waitlist.js
// Vercel Serverless endpoint — server side only. Uses SUPABASE_SERVICE_ROLE_KEY set in Vercel env.

import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { full_name, email, role, availability, notes } = req.body || {};

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: "Server config error" });
    return;
  }

  try {
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal" // or return=representation to get row back
      },
      body: JSON.stringify({
        full_name: full_name || null,
        email,
        role: role || null,
        availability: availability || null,
        notes: notes || null
      })
    });

    if (!insertResp.ok) {
      const text = await insertResp.text();
      console.error("Supabase error:", text);
      return res.status(500).json({ error: "Database insert failed", details: text });
    }

    // success
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
