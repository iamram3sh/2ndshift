// src/main.js
console.log("2ndShift client loaded");

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
        statusEl.style.color = "#9adfcd";
        statusEl.textContent = "Thanks — you’ve been added to the waitlist.";
        form.reset();
      } else {
        statusEl.style.color = "#f39c9c";
        statusEl.textContent = data.error || "Submission failed. Try again.";
        console.error("waitlist error", data);
      }
    } catch (err) {
      statusEl.style.color = "#f39c9c";
      statusEl.textContent = "Network error. Try again.";
      console.error(err);
    }
  });
}
