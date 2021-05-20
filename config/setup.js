const configFlat = {
    pathMap: {
        '/structure': '/config/structure.en.json',
        '/translations': '/config/translations.en.json'
    },
    cms: null,
    devMode: true // this enables fast cms start via 'a' key hold & click
}

const configCms = {
    pathMap: {
        '/structure': '{cms}/structure',
        '/translations': '{cms}/translations'
    },
    // cms: 'https://127.0.0.1:3000/',
    cms: 'http://127.0.0.1:8082/',
    devMode: true // this enables fast cms start via 'a' key hold & click
}

window.BASE_CONFIG = configFlat
