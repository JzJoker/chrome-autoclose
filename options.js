document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider and toggle state from storage
    chrome.storage.sync.get({
        inactiveDuration: 10,
        autoCloseEnabled: true
    }, function(items) {
        document.getElementById('durationSlider').value = items.inactiveDuration;
        document.getElementById('durationValue').textContent = items.inactiveDuration;
        document.getElementById('autoCloseToggle').checked = items.autoCloseEnabled;
    });

    // Event listener for slider change
    document.getElementById('durationSlider').addEventListener('input', function() {
        let duration = parseFloat(this.value); // Use parseFloat for decimal values
        document.getElementById('durationValue').textContent = duration.toFixed(1); // Display one decimal place
        chrome.storage.sync.set({ inactiveDuration: duration });
    });

    // Event listener for toggle change
    document.getElementById('autoCloseToggle').addEventListener('change', function() {
        let autoCloseEnabled = this.checked;
        chrome.storage.sync.set({ autoCloseEnabled: autoCloseEnabled });
    });
});
