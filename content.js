// Initialize variables
let inactiveTimer;
let warningTimer;

// Function to prompt the user
const closeTabs = () => {
  chrome.runtime.sendMessage({ action: "closeTabs" });
};

// Function to change icon to closing
const changeIcon = () => {
  chrome.runtime.sendMessage({ action: "changeIcon" });
};

// Function to handle activity and reset everything
const resetInactiveTimer = () => {
  clearTimeout(inactiveTimer);
  clearTimeout(warningTimer);
  chrome.runtime.sendMessage({ action: "resetIcon" });

  warningTimer = setTimeout(changeIcon, 2.5 *  1000) // 2.5 seconds for warning
  inactiveTimer = setTimeout(closeTabs, 5 *  1000); // 5 seconds for warning
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
