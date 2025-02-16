// Function to calculate the countdown
function updateCountdown() {
    // Set the target date (May 3, 2025)
    const targetDate = new Date("May 3, 2025").getTime();
    
    // Get the current date
    const today = new Date().getTime();

    // Calculate the difference in milliseconds
    const timeRemaining = targetDate - today;

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    // Update the counter in the HTML
    document.getElementById("counter").innerHTML = `${daysRemaining} DAYS TO GO!`;
    console.log(daysRemaining);
}

// Call the function on page load
updateCountdown();
