const switchTheme = (value) => {
    if (value == 'on') {
        document.documentElement.setAttribute('darkMode', 'on')
    }
    if (value == 'off') {
        document.documentElement.setAttribute('darkMode', 'off')
    }
}

getFromStorage('settings').then((data) => {
    let state = data.darkMode
    console.log(state)
    switchTheme(state)
})
