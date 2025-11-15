const form = document.getElementById("waitlist-form");
const statusEl = document.getElementById("waitlist-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Submitting…";

    const payload = {
      full_name: form.full_name.value,
      email: form.email.value,
      role: form.role.value,
      availability: form.availability.value,
      notes: form.notes.value
    };

    try {
      const resp = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        statusEl.style.color = "#80ffcc";
        statusEl.textContent = "You're on the waitlist!";
        form.reset();
      } else {
        statusEl.style.color = "#ff8080";
        statusEl.textContent = data.error || "Failed. Try again.";
      }
    } catch (err) {
      statusEl.style.color = "#ff8080";
      statusEl.textContent = "Network error.";
    }
  });
}
