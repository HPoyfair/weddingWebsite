// Import Supabase client
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
    console.log("Script loaded"); // Debugging: Confirm script is running
    updateCountdown();

    // Handle RSVP form submission (Only if RSVP form exists)
    const rsvpForm = document.getElementById("rsvp-form");
    if (rsvpForm) {
        console.log("RSVP form found"); // Debugging: Confirm form is found

        // Checkbox for "also request an invitation"
        const alsoInviteCheckbox = document.getElementById("also-invite");

        rsvpForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Get form values
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;
            const guests = parseInt(document.getElementById("guests").value, 10);
            const alsoInvite = alsoInviteCheckbox ? alsoInviteCheckbox.checked : false;

            // Validate form inputs
            if (!name || !address || !phone || isNaN(guests) || guests < 1) {
                alert("Please fill out all fields correctly.");
                return;
            }

            // Insert into RSVP table
            try {
                const { data: rsvpData, error: rsvpError } = await supabase
                    .from("rsvp_guests")
                    .insert([{ name, address, phone_number: phone, guests_count: guests }]);

                if (rsvpError) {
                    console.error("RSVP Error:", rsvpError);
                    alert("Error submitting RSVP. Please try again.");
                    return;
                }

                console.log("RSVP Data inserted successfully:", rsvpData);

                // If "also request an invitation" is checked, insert into Invitation table
                if (alsoInvite) {
                    console.log("Attempting to insert into Invitation table...");
                    const { data: inviteData, error: inviteError } = await supabase
                        .from("Invitation") // Ensure this matches the table name in Supabase
                        .insert([{ name, address, phone_number: phone }]);

                    if (inviteError) {
                        console.error("Invitation Error Details:", inviteError);
                        console.error("Invitation Error Message:", inviteError.message);
                        console.error("Invitation Error Details:", inviteError.details);
                        alert("Error submitting invitation. Please try again.");
                    } else {
                        console.log("Invitation Data inserted successfully:", inviteData);
                    }
                }

                rsvpForm.reset();
                alert("RSVP submitted successfully!");
            } catch (err) {
                console.error("Database error:", err);
                alert("An unexpected error occurred. Please try again.");
            }
        });
    }

    // Handle Invitation form submission (Only if Invitation form exists)
    const inviteForm = document.getElementById("invite-form");
    if (inviteForm) {
        console.log("Invitation form found"); // Debugging
        const alsoRSVPCheckbox = document.getElementById("also-rsvp");
        const guestsContainer = document.getElementById("guests-container");

        // Show/hide guest input field based on checkbox state
        if (alsoRSVPCheckbox) {
            alsoRSVPCheckbox.addEventListener("change", function () {
                guestsContainer.style.display = this.checked ? "block" : "none";
            });
        }

        inviteForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("invite-name").value;
            const address = document.getElementById("invite-address").value;
            const phone = document.getElementById("invite-phone").value;
            const alsoRSVP = alsoRSVPCheckbox.checked;
            let guests = alsoRSVP ? parseInt(document.getElementById("invite-guests").value, 10) : null;

            // Insert into Invitation table
            try {
                const { data: inviteData, error: inviteError } = await supabase
                    .from("Invitation") // Ensure this matches the table name in Supabase
                    .insert([{ name, address, phone_number: phone }]);

                if (inviteError) {
                    console.error("Invitation Error:", inviteError);
                    alert("Error submitting invitation. Please try again.");
                    return;
                }

                console.log("Invitation Data inserted successfully:", inviteData);

                // If "also RSVP" is checked, insert into RSVP table with the guests count
                if (alsoRSVP) {
                    const { data: rsvpData, error: rsvpError } = await supabase
                        .from("rsvp_guests")
                        .insert([{ name, address, phone_number: phone, guests_count: guests || 1 }]); // Default to 1 if empty

                    if (rsvpError) {
                        console.error("RSVP Error:", rsvpError);
                        alert("Error submitting RSVP. Please try again.");
                    } else {
                        console.log("RSVP Data inserted successfully:", rsvpData);
                    }
                }

                inviteForm.reset();
                alert("Invitation request submitted successfully!");
                guestsContainer.style.display = "none"; // Hide guest input field after submission
            } catch (err) {
                console.error("Database error:", err);
                alert("An unexpected error occurred. Please try again.");
            }
        });
    }
});