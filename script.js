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

    // Handle RSVP form submission
    const rsvpForm = document.getElementById("rsvp-form");
    if (rsvpForm) {
        console.log("RSVP form found"); // Debugging: Confirm form is found
        rsvpForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Get form values
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;
            const guests = parseInt(document.getElementById("guests").value, 10);

            // Validate form inputs
            if (!name || !address || !phone || isNaN(guests) || guests < 1) {
                alert("Please fill out all fields correctly.");
                return;
            }

            // Insert into Supabase
            try {
                const { data, error } = await supabase
                    .from("rsvp_guests")
                    .insert([
                        { 
                            name, 
                            address, 
                            phone_number: phone, 
                            guests_count: guests  
                        }
                    ]);

                // Show success or error message
                const responseMessage = document.getElementById("response-message");
                if (error) {
                    console.error("Supabase error:", error);
                    responseMessage.textContent = "Error submitting RSVP. Please try again.";
                    responseMessage.style.color = "red";
                } else {
                    console.log("RSVP Data inserted successfully:", data);
                    responseMessage.textContent = "RSVP submitted successfully!";
                    responseMessage.style.color = "green";
                    rsvpForm.reset();
                }
            } catch (err) {
                console.error("Database error:", err);
            }
        });
    } else {
        console.error("RSVP form not found");
    }

    // Handle Invitation form submission
    const inviteForm = document.getElementById("invite-form");
    const alsoRSVPCheckbox = document.getElementById("also-rsvp");
    const guestsContainer = document.getElementById("guests-container");

    // Show/hide guest input field based on checkbox state
    if (alsoRSVPCheckbox) {
        alsoRSVPCheckbox.addEventListener("change", function () {
            if (this.checked) {
                guestsContainer.style.display = "block"; // Show the input field
            } else {
                guestsContainer.style.display = "none"; // Hide the input field
            }
        });
    }

    if (inviteForm) {
        inviteForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("invite-name").value;
            const address = document.getElementById("invite-address").value;
            const phone = document.getElementById("invite-phone").value;
            const alsoRSVP = alsoRSVPCheckbox.checked;
            let guests = null;

            // If RSVP is checked, get the number of guests
            if (alsoRSVP) {
                guests = parseInt(document.getElementById("invite-guests").value, 10);
            }

            // Insert into Invitation table
            try {
                const { data: inviteData, error: inviteError } = await supabase.from("invitations").insert([
                    { name, address, phone_number: phone }
                ]);

                if (inviteError) {
                    console.error("Invitation Error:", inviteError);
                    return;
                }

                // If "also RSVP" is checked, insert into RSVP table with the guests count
                if (alsoRSVP) {
                    const { data: rsvpData, error: rsvpError } = await supabase.from("rsvp_guests").insert([
                        { name, address, phone_number: phone, guests_count: guests || 1 } // Default to 1 if empty
                    ]);

                    if (rsvpError) {
                        console.error("RSVP Error:", rsvpError);
                    }
                }

                inviteForm.reset();
                alert("Invitation request submitted successfully!");
                guestsContainer.style.display = "none"; // Hide guest input field after submission
            } catch (err) {
                console.error("Database error:", err);
            }
        });
    }
});
