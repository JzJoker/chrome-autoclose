//initialize variables
let inactiveTimer;
let warningTimer;
let inactiveDuration;
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
    clearTimeout(warningTimer);
    clearTimeout(inactiveTimer);

    if (document.visibilityState === 'visible' && autoCloseEnabled) {
        warningTimer = setTimeout(notifyUser, inactiveDuration * 60 - 5000); // Notify 5 seconds before closing
        inactiveTimer = setTimeout(closeTabs, inactiveDuration * 60); // Close tabs after inactiveDuration
    }
};

// Event listeners for mousemove, click, and keydown events
window.addEventListener("mousemove", function(){
    resetInactiveTimer();
});
window.addEventListener("click", function(){
    resetInactiveTimer();
});
window.addEventListener("keydown", function(){
    resetInactiveTimer();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        resetInactiveTimer();
    } else {
        clearTimeout(warningTimer);
        clearTimeout(inactiveTimer);
    }
});

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
