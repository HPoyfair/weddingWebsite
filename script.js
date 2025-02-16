// Import Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://tajxrpenrboeywymsmoh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhanhycGVucmJvZXl3eW1zbW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDM3MDAsImV4cCI6MjA1NDYxOTcwMH0.Wt__mV01DO7RzFIVtyVfVbjNBKPWxjjl0JBc7zIm7YM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to calculate the countdown
function updateCountdown() {
    const targetDate = new Date("May 3, 2025").getTime();
    const today = new Date().getTime();
    const timeRemaining = targetDate - today;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    // Update counter in the HTML
    const counterElement = document.getElementById("counter");
    if (counterElement) {
        counterElement.innerHTML = `${daysRemaining} DAYS TO GO!`;
    }
}

// Ensure script runs after page loads
document.addEventListener("DOMContentLoaded", function () {
    updateCountdown();

    // Handle RSVP form submission
    const rsvpForm = document.getElementById("rsvp-form");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;
            const guests = parseInt(document.getElementById("guests").value, 10);

            // Insert into Supabase
            try {
                const { data, error } = await supabase.from("rsvp_guests").insert([
                    { name, address, phone_number: phone, guests_count: guests }
                ]);

                // Show success or error message
                const responseMessage = document.getElementById("response-message");
                if (error) {
                    responseMessage.textContent = "Error submitting RSVP. Please try again.";
                    responseMessage.style.color = "red";
                } else {
                    responseMessage.textContent = "RSVP submitted successfully!";
                    responseMessage.style.color = "green";
                    rsvpForm.reset();
                }
            } catch (err) {
                console.error("Database error:", err);
            }
        });
    }
});
