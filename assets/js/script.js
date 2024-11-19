const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupInfo = document.getElementById("popup-info");
const closePopup = document.getElementById("close-popup");
const baseInfo = document.getElementById("base-info");
const leaseTerm = document.getElementById("lease-term");
const reservePopup = document.getElementById("reserve-popup");
const formPopup = document.getElementById("form-popup");
const closeFormPopup = document.getElementById("close-form-popup");
const reservationForm = document.getElementById("reservation-form");
const errorMessageContainer = document.getElementById("error-message"); // Add a container for error messages

const mailboxRates = {
    "Small Mailbox": 20,
    "Medium Mailbox": 30,
    "Large Mailbox": 35
};

document.getElementById("small-card").addEventListener("click", () => {
    showPopup("Small Mailbox", "Small units available for $20/month.", mailboxRates["Small Mailbox"]);
});

document.getElementById("medium-card").addEventListener("click", () => {
    showPopup("Medium Mailbox", "Medium units available for $30/month.", mailboxRates["Medium Mailbox"]);
});

document.getElementById("large-card").addEventListener("click", () => {
    showPopup("Large Mailbox", "Large units available for $35/month.", mailboxRates["Large Mailbox"]);
});

function showPopup(title, info, rate) {
    popupTitle.textContent = title;
    baseInfo.textContent = info;
    leaseTerm.textContent = "";
    popup.dataset.rate = rate; 
    popup.style.display = "flex";
}

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    document.getElementById("popup-overlay").style.display = "none"; // Hide the overlay
});

window.addEventListener("click", (event) => {
    const overlay = document.getElementById("popup-overlay");
    if (event.target === overlay) {
        popup.style.display = "none";
        overlay.style.display = "none"; // Hide the overlay
    }
});

// Dropdown Menu Trigger
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
});

// Initially hides the reserve button
reservePopup.style.display = "none";

// Dropdown menu event listener
document.querySelectorAll("#dropdown1 li a").forEach(item => {
    item.addEventListener("click", (event) => {
        const selectedTerm = event.target.textContent;
        const rate = parseFloat(popup.dataset.rate);
        let totalCost = 0;

        switch (selectedTerm) {
            case "Monthly":
                totalCost = rate;
                break;
            case "3 months":
                totalCost = rate * 3;
                break;
            case "6 months":
                totalCost = rate * 6;
                break;
            case "9 months":
                totalCost = rate * 9;
                break;
            case "Yearly":
                totalCost = rate * 12;
                break;
        }
        leaseTerm.textContent = `- Lease term: ${selectedTerm} (Total: $${totalCost})`;
        leaseTerm.dataset.selectedTerm = selectedTerm; // Store the selected term in a dataset attribute
        reservePopup.style.display = "inline-block";
    });
});

reservePopup.addEventListener("click", () => {
    formPopup.style.display = "flex";
});

closeFormPopup.addEventListener("click", () => {
    formPopup.style.display = "none";
});

reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Retrieve lease total and term from popup
    const leaseTermInfo = leaseTerm.textContent;
    const leaseTotalMatch = leaseTermInfo.match(/\(Total: \$(\d+)\)/);
    const leaseTotal = leaseTotalMatch ? parseFloat(leaseTotalMatch[1]) : null;
    const selectedLeaseTerm = leaseTerm.dataset.selectedTerm;

    if (!name || !leaseTotal || !email || !selectedLeaseTerm) {
        displayErrorMessage("Name, lease total, lease term, or email is missing. Please check your inputs.");
        return;
    }

    // Format lease total as currency
    const formattedLeaseTotal = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(leaseTotal);

    // Assign a random mailbox number
    const randomMailboxNumber = `Mailbox#-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`;

    // Store name, lease total, term, email, and mailbox number in local storage
    localStorage.setItem("name", name);
    localStorage.setItem("leaseTotal", formattedLeaseTotal);
    localStorage.setItem("leaseTerm", selectedLeaseTerm);
    localStorage.setItem("email", email);
    localStorage.setItem("mailboxNumber", randomMailboxNumber);

    // Display local storage modal after reservation
    const modal = document.getElementById("local-storage-modal");
    const list = document.getElementById("local-storage-list");

    // Add custom message
    list.innerHTML = `<p>A confirmation email has been sent to ${email} with the info below. Thank you for your reservation!</p>`;

    // Populate the list with localStorage items
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        const listItem = document.createElement("li");
        listItem.textContent = `${key}: ${value}`;
        list.appendChild(listItem);
    }

    modal.style.display = "flex";

    formPopup.style.display = "none";
});

// Display error message in a designated container
function displayErrorMessage(message) {
    if (errorMessageContainer) {
        errorMessageContainer.textContent = message;
        errorMessageContainer.style.display = "block";
        setTimeout(() => {
            errorMessageContainer.style.display = "none";
        }, 5000);
    }
}

// Close button functionality
document.getElementById("close-local-storage-modal").addEventListener("click", () => {
    document.getElementById("local-storage-modal").style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
    const modal = document.getElementById("local-storage-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});