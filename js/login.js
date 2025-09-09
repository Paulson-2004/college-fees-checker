// js/login.js

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get values
    const sprNo = document.getElementById("sprNo").value.trim();
    const dob = document.getElementById("dob").value;

    // Validate input
    if (!sprNo || !dob) {
        document.getElementById("error-message").innerText = "Please enter both SPR NO and DOB.";
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/login', { // Ensure this URL matches your backend's address
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sprNo, dob })
        });

        const data = await response.json();

        if (data.success) {
            // Store the SPR NO in sessionStorage for better security
            sessionStorage.setItem("sprNo", sprNo);

            // Redirect to fee page
            window.location.href = "fee.html";
        } else {
            document.getElementById("error-message").innerText = data.message || "Login failed. Please try again.";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("error-message").innerText = "An error occurred during login. Please try again later.";
    }
});
