async function get(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (value) => {resolve(value)})
        } catch (err) {reject(err)}
    })
}

chrome.storage.sync.set({timings: {
    //noctural denotes the fact of the start and end times being the start and end times of rest, not work. This combats problems due to working through midnight
    6: {nocturnal: 'false', start: '09', end: '14', blacklisted: 'https://www.reddit.com/'}
}})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let url = tab.url
    let date = new Date()
    let blocked = await get('timings')
    let day = date.getDay()
    console.log(day)
    let hour = date.getHours()
    console.log(blocked.timings[day].start)
    console.log(hour)
    console.log(blocked.timings[day].end)
    console.log(blocked.timings[day].nocturnal)
    if (((blocked.timings[day].start < hour < blocked.timings[day].end) && (blocked.timings[day].nocturnal == "false")) || (!(blocked.timings[day].start < hour < blocked.timings[day].end) && (blocked.timings[day].nocturnal == "true"))) {
        if (tab.url == blocked.timings[day].blacklisted) {
            chrome.tabs.remove(tabId)
        }
    }
})