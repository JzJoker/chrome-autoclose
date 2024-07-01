// Initialize variables
let inactiveTimer;
let warningTimer;
let inactiveDuration = 600000; // Default inactive duration in milliseconds (10 minutes)
let autoCloseEnabled = true; // Default autoCloseEnabled state

// Function to close all tabs
const closeTabs = () => {
    chrome.runtime.sendMessage({ action: "closeTabs" });
};

// Function to notify user
const notifyUser = () => {
    chrome.runtime.sendMessage({ action: "notifyUser" });
};

// Function to handle activity and notify users
const resetInactiveTimer = () => {
    clearTimeout(inactiveTimer);
    clearTimeout(warningTimer);

    if (autoCloseEnabled) {
        warningTimer = setTimeout(notifyUser, inactiveDuration * 60 - 5000); // Notify 5 seconds before closing
        inactiveTimer = setTimeout(closeTabs, inactiveDuration * 60);
    }
};

// Function to handle mouse movement
const handleMouseMove = () => {
    resetInactiveTimer();
};

// Function to handle key presses
const handleKeyDown = () => {
    resetInactiveTimer();
};

// Event listeners for mousemove and keydown events
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("keydown", handleKeyDown);

// Initialize settings from storage
chrome.storage.sync.get({
    inactiveDuration: 600,
    autoCloseEnabled: true
}, function(items) {
    inactiveDuration = items.inactiveDuration * 1000; // Convert seconds to milliseconds
    autoCloseEnabled = items.autoCloseEnabled;

    // Initialize inactive timer
    resetInactiveTimer();
});
