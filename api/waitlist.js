export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate environment variables
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return res.status(500).json({
      error: "Missing Supabase environment variables",
      details: { SUPABASE_URL, SERVICE_ROLE: !!SERVICE_ROLE }
    });
  }

  const payload = req.body;

  try {
    const url = `${SUPABASE_URL}/rest/v1/waitlist`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Supabase insert failed",
        supabase_error: data
      });
    }

    return res.status(200).json({ success: true, data: JSON.parse(data) });

  } catch (err) {
    return res.status(500).json({
      error: "Unexpected error",
      details: err.message || err
    });
  }
}
