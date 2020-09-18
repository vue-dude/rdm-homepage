const flat = {
    pathMap: {
        '/structure': '/config/structure.en.json',
        '/translations': '/config/translations.en.json'
    },
    devMode: false
}
const cms = {
    pathMap: {
        '/structure': '{cms}/structure',
        '/translations': '{cms}/translations'
    },
    cms: 'https://qa.rdm.mpdl.mpg.de:8443/',
    devMode: true // this enables fast cms start via 'a' key hold & click
}

window.BASE_CONFIG = window.location.origin === 'https://qa.rdm.mpdl.mpg.de:8443' ? cms : flat

console.log('BASE: window.location = ', window.location)
console.log('BASE: window.BASE_CONFIG = ', window.BASE_CONFIG)
