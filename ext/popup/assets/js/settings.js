let darkModeSelect = document.getElementById("dark-mode")
let syncStorageSelect = document.getElementById("sync-storage")

getFromStorage('settings').then(data => {
    darkModeSelect.value = data.darkMode
    syncStorageSelect.value = data.syncStorage
})

darkModeSelect.addEventListener('change', () => {
    let newSetting = darkModeSelect.value
    chrome.storage.sync.set({
        settings: {
            darkMode: newSetting,
            syncStorage: syncStorageSelect.value
        }
    })
})

syncStorageSelect.addEventListener('change', () => {
    let newSetting = syncStorageSelect.value
    chrome.storage.sync.set({
        settings: {
            darkMode: darkModeSelect.value,
            syncStorage: newSetting
        }
    })
})