// js/fee.js

document.addEventListener("DOMContentLoaded", async () => {
    const sprNo = sessionStorage.getItem("sprNo");

    if (!sprNo) {
        document.getElementById("error-message").innerText = "No student data found. Please log in again.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/fee/${sprNo}`); // Ensure this URL matches your backend's address
        const data = await response.json();

        console.log("Response Data:", data); // Log the response data for debugging

        if (data.success) {
            displayFeeDetails(data.data);
        } else {
            document.getElementById("error-message").innerText = data.message;
        }
    } catch (error) {
        console.error("Error fetching fee details:", error);
        document.getElementById("error-message").innerText = "An error occurred while fetching fee details.";
    }
});

// Function to display fee details
function displayFeeDetails(student) {
    document.getElementById("sprNo").innerText = student.sprNo;
    document.getElementById("dob").innerText = new Date(student.dob).toLocaleDateString();
    document.getElementById("course").innerText = student.course;
    document.getElementById("year").innerText = student.year;

    const feeDetails = student.feeDetails;

    document.getElementById("hostelFee").innerText = feeDetails.hostelFee ? feeDetails.hostelFee.toLocaleString() : "N/A";
    document.getElementById("tuitionFee").innerText = feeDetails.tuitionFee ? feeDetails.tuitionFee.toLocaleString() : "N/A";
    document.getElementById("textbookFee").innerText = feeDetails.textbookFee ? feeDetails.textbookFee.toLocaleString() : "N/A";
    document.getElementById("skillDevFee").innerText = feeDetails.skillDevFee ? feeDetails.skillDevFee.toLocaleString() : "N/A";
    document.getElementById("examStationeryFee").innerText = feeDetails.examStationeryFee ? feeDetails.examStationeryFee.toLocaleString() : "N/A";
    document.getElementById("notebookFee").innerText = feeDetails.notebookFee ? feeDetails.notebookFee.toLocaleString() : "N/A";

    // Calculate total
    const total = calculateTotal(feeDetails);
    document.querySelector(".total-payable").innerText = `Total Payable: ${total.toLocaleString()} INR`;
}

// Function to calculate total fee
function calculateTotal(feeDetails) {
    return (
        parseFloat(feeDetails.hostelFee || 0) +
        parseFloat(feeDetails.tuitionFee || 0) +
        parseFloat(feeDetails.textbookFee || 0) +
        parseFloat(feeDetails.skillDevFee || 0) +
        parseFloat(feeDetails.examStationeryFee || 0) +
        parseFloat(feeDetails.notebookFee || 0)
    );
}
