const getFromStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            new Promise((resolve, reject) => {
                // this is very ugly but this is just to get the settings from localStorage
                try {
                    chrome.storage.sync.get('settings', (value) => {
                        resolve(value['settings'])
                    })
                } catch (err) {
                    reject(err)
                }
            }).then((data) => {
                console.log(data)
                if (data.syncStorage == 'on') {
                    chrome.storage.sync.get(key, (value) => {
                        resolve(value[key])
                    })
                } else {
                    console.log('getting from local')
                    chrome.storage.local.get(key, (value) => {
                        resolve(value[key])
                    })
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

async function saveToStorage(data) {
    getFromStorage('settings').then((settings) => {
        if (settings.syncStorage == 'on') {
            chrome.storage.sync.set(data)
        } else {
            console.log('saving to local')
            chrome.storage.local.set(data)
        }
    })
}
