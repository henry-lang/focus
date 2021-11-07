const getFromStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (value) => {
                resolve(value[key])
            })
        } catch (err) {
            reject(err)
        }
    })
}
