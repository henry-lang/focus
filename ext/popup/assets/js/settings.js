let darkModeSelect = document.getElementById("dark-mode")
let syncStorageSelect = document.getElementById("sync-storage")

getFromStorage('settings').then(data => {
    darkModeSelect.value = data.darkMode
    syncStorageSelect.value = data.syncStorage
})

darkModeSelect.addEventListener('change', async () => {
    let newSettings = {settings: {darkMode: darkModeSelect.value, syncStorage: syncStorageSelect.value}}
    console.log("DarkModeSelect was changed!", darkModeSelect.value)
    await chrome.storage.sync.set(newSettings)
    await chrome.storage.local.set(newSettings)
    switchTheme(darkModeSelect.value)
})

syncStorageSelect.addEventListener('change', async () => {
    let newSettings = {settings: {darkMode: darkModeSelect.value, syncStorage: syncStorageSelect.value}}
    console.log("SyncStorageSelect was changed!", syncStorageSelect.value)
    await chrome.storage.sync.set(newSettings)
    await chrome.storage.local.set(newSettings)
})