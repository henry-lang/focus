importScripts('popup/assets/js/getFromStorage.js')
let lastTabId = null
let extensionDomain = new URL(chrome.runtime.getURL('popup/blocked.html')).hostname

//nocturnal denotes the start time being later than the end time, effectively making the focus period span through midnight

const parseTime = (time) => {
    // must be formatted in 'hh:mm'
    let splitTime = time.split(':')
    return parseInt(splitTime[0]) * 60 + parseInt(splitTime[1])
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status != 'loading') {
        return
    }
    let date = new Date()
    let day = date.getDay()
    let minutesSinceMidnight = date.getHours() * 60 + date.getMinutes()
    let blocked = (await getFromStorage('timings'))[day]
    let start = parseTime(blocked.start)
    let end = parseTime(blocked.end)
    let fullurl = new URL(tab.url)
    let domain = fullurl.hostname
    let splitTabHostname = domain.split('.')
    let block = false
    if (splitTabHostname.length > 2) {
        if (splitTabHostname[0] == 'www') {
            splitTabHostname.shift()
        }
    }
    let splitBlockedName = splitTabHostname
    if (
        (start <= minutesSinceMidnight &&
            minutesSinceMidnight < end &&
            blocked.nocturnal == false) ||
        (!(end <= minutesSinceMidnight && minutesSinceMidnight < start) &&
            blocked.nocturnal == true)
    ) {
        for (let n = 0; n < blocked.blocklisted.length; n++) {
            splitBlockedName = blocked.blocklisted[n].split('.')
            if (splitBlockedName.length <= splitTabHostname.length) {
                block = true
                for (let o = 0; o < splitBlockedName.length; o++) {
                    if (
                        !(
                            splitBlockedName[splitBlockedName.length - (o + 1)] ===
                            splitTabHostname[splitTabHostname.length - (o + 1)]
                        )
                    ) {
                        block = false
                    }
                }
            }
            if (block == true) {
                console.log('11111111111111111111111111111111111111111111111111111111111111111111111')
                chrome.tabs.update({url: chrome.runtime.getURL('popup/blocked.html')})
                lastTabId = tabId
                break
            }
        }
    }
})

chrome.runtime.onConnect.addListener((connection) => {
    connection.onMessage.addListener(async (msg) => {
        /*
            Sent in one object:
            type - one of the following cases.
            day - 0..6
            page - String of the page of add/remove
            time - Time to change
        */
        let data = await getFromStorage('timings')
        console.log(data)
        switch (msg.type) {
            case 'add_page': {
                console.log('Add page was fired!')
                data[msg.day].blocklisted.push(msg.page)
                break
            }
            case 'delete_page': {
                data[msg.day].blocklisted = data[msg.day].blocklisted.filter(
                    (page) => page !== msg.page
                ) // Delete the page if it exists, if it doesn't nothing will happen
                break
            }
            case 'change_start': {
                data[msg.day].start = msg.time
                if (data[msg.day].start <= data[msg.day].end) {
                    data[msg.day].nocturnal = false
                }
                if (data[msg.day].start > data[msg.day].end) {
                    data[msg.day].nocturnal = true
                }
                break
            }
            case 'change_end': {
                data[msg.day].end = msg.time
                if (data[msg.day].start <= data[msg.day].end) {
                    data[msg.day].nocturnal = false
                }
                if (data[msg.day].start > data[msg.day].end) {
                    data[msg.day].nocturnal = true
                }
                break
            }
            default: {
                console.log('Unidentified type.')
                break
            }
        }
        await saveToStorage({timings: data})
    })
})

chrome.runtime.onInstalled.addListener(async (details) => {
    // Ayush said foam.
    if (details.reason == 'install') {
        let defaultConfig = {
            nocturnal: false,
            start: '09:50',
            end: '18:30',
            blocklisted: ['example.com'],
            allowlisted: [
                'https://www.youtube.com/watch?v=LqA35eLEbug',
                'https://www.youtube.com/watch?v=jMtG9SyZfAc',
            ],
        }
        let initSettings = {
            timings: {
                0: defaultConfig,
                1: defaultConfig,
                2: defaultConfig,
                3: defaultConfig,
                4: defaultConfig,
                5: defaultConfig,
                6: defaultConfig,
            },
            settings: {
                darkMode: 'off',
                syncStorage: 'on',
            },
        }
        await chrome.storage.sync.set(initSettings)
        await chrome.storage.local.set(initSettings)
    }
})
