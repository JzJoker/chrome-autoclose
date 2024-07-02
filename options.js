document.addEventListener('DOMContentLoaded', function() {
    // Initialize input and toggle state from storage
    chrome.storage.sync.get({
        inactiveDuration: 10,
        autoCloseEnabled: true
    }, function(items) {
        // Update slider and input value from storage
        document.getElementById('durationInput').value = items.inactiveDuration;
        document.getElementById('durationSlider').value = items.inactiveDuration;
        document.getElementById('autoCloseToggle').checked = items.autoCloseEnabled;
    });

    // Function to update storage only when slider handle is released
    const updateStorageOnSliderRelease = () => {
        let duration = parseFloat(document.getElementById('durationSlider').value);
        document.getElementById('durationInput').value = duration.toFixed(1); // Display one decimal place
        chrome.storage.sync.set({ inactiveDuration: duration });
    };

    // Event listener for input change
    document.getElementById('durationInput').addEventListener('input', function() {
        let duration = parseFloat(this.value);
        document.getElementById('durationSlider').value = duration;
        // Note: Do not update storage here
    });

    // Event listener for slider input change (on input)
    document.getElementById('durationSlider').addEventListener('input', function() {
        let duration = parseFloat(this.value); // Update input value immediately
        document.getElementById('durationInput').value = duration.toFixed(1); // Display one decimal place
    });

    // Event listener for slider change (on change)
    document.getElementById('durationSlider').addEventListener('change', updateStorageOnSliderRelease);

    // Event listener for toggle change
    document.getElementById('autoCloseToggle').addEventListener('change', function() {
        let autoCloseEnabled = this.checked;
        chrome.storage.sync.set({ autoCloseEnabled: autoCloseEnabled });
        //refresh page
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);
        });    });
});
