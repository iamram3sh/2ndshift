// api/waitlist.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const body = req.body;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        full_name: body.full_name || null,
        email: body.email,
        role: body.role || null,
        availability: body.availability || null,
        notes: body.notes || null
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Insert failed", details: text });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
}
