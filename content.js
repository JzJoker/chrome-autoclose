// Initialize variables
let inactiveTimer;
let warningTimer;
let inactiveDuration = 600 * 1000; //in seconds (10 Minutes for closing)


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

  warningTimer = setTimeout(notifyUser, inactiveDuration - 5 * 1000) // 5 seconds for warning
  inactiveTimer = setTimeout(closeTabs, inactiveDuration); 
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

// Initialize inactive timer
resetInactiveTimer();
