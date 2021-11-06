async function get(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (value) => {resolve(value)})
        } catch (err) {reject(err)}
    })
}

chrome.storage.sync.set({timings: {
    6: {a: '1', b: '2', c: '3'}
}})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let url = tab.url
    let date = new Date()
    let blocked = await get('timings')
    console.log(blocked.timings[6])
})