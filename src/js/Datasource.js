import axios from 'axios'

function Datasource() {
    //
    let base = {
        cms: '/',
        pathMap: {},
        pathname: null
    }
    if (window.BASE_CONFIG) {
        base.cms = _.isString(window.BASE_CONFIG.cms) ? window.BASE_CONFIG.cms : base.cms
        base.pathMap = _.isPlainObject(window.BASE_CONFIG.pathMap) ? window.BASE_CONFIG.pathMap : base.pathMap
    }

    base.pathname = window.location.pathname.split('')
    while (base.pathname.length > 0 && base.pathname.pop() !== '/') {}
    base.pathname = `${base.pathname.join('')}/`

    _.each(base.pathMap, (path, key) => (base.pathMap[key] = _.replace(path, '{cms}/', base.cms)))

    console.log('DS:INIT window.BASE_CONFIG = ', window.BASE_CONFIG)
    console.log('DS:INIT base = ', base)
    console.log('DS:INIT base.pathMap = ', base.pathMap)

    const config = {
        pathMap: base.pathMap,
        saveApi: `${base.cms}update`,
        uploadApi: `${base.cms}upload`,
        mediaApi: `${base.cms}media`,
        pulishApi: `${base.cms}publish`,
        authApi: `${base.cms}authenticate`,
        authConfirmApi: `${base.cms}auth-confirm`,
        ckEditor: 'lib/ckeditor/ckeditor.js',
        structure: null,
        sessionTimeoutMsec: 10000,
        translations: {},
        setup: {},
        circleNav: []
    }

    console.log('DS:INIT config = ', config)

    const getConfig = () => config

    const getPath = path => {
        if (path.substr(0, 1) === '/') {
            if (config.pathMap[path]) {
                if (config.pathMap[path].substr(0, 1) === '/') {
                    return `${base.pathname}${config.pathMap[path].substr(1)}`
                }
                return config.pathMap[path]
            }
            return `${base.pathname}${path.substr(1)}`
        }
        // this resolves a absolute path from a remote api
        return path
    }
    this.getPath = getPath

    const updateMediaPaths = html => {
        if (_.isString(html)) {
            let path = getPath('/media/') // flat file mode
            if (base.cms && base.cms !== '/') {
                path = `${base.cms}media/` // api / cms mode
            }
            html = html.split('src="/media/').join(`src="${path}`)
        }
        return html
    }
    this.updateMediaPaths = updateMediaPaths

    const post = async (api, data = {}, options = {}) => {
        data.token = globals.getAdminToken()
        return axios.create().post(getPath(api), data, options)
    }

    const getValidI18nKey = i18nKey => {
        const trns = _.get(config.translations, `${globals.getLocale()}.${i18nKey}.__0`)
        return _.isString(trns) ? `${i18nKey}.__0` : i18nKey
    }
    this.getValidI18nKey = getValidI18nKey

    // only UI elements
    const setTranslationFallbacks = (translations, lng, key, i18n) => {
        let strg = _.get(translations, `${lng}.${i18n}`)
        if (!_.isString(strg)) {
            strg = _.get(translations, `${lng}._global.${key}`)
            if (!_.isString(strg)) {
                strg = key
            }
            _.set(translations, `${lng}.${i18n}`, strg)
        }
    }

    const addTranslations = trns => {
        // trns == new loaded
        _.each(trns, (tr, lng) => {
            _.each(config.structure.navigation, (l1, keyL1) => {
                setTranslationFallbacks(trns, lng, keyL1, l1.i18nKey)
                const add = _.get(trns, `${lng}.special.ui.nav.${keyL1}`) || {}
                add.icon = _.isString(add.icon) ? add.icon : keyL1
                config.structure.navigation[keyL1] = { ...l1, ...add }
                _.each(l1.sub, (l2, keyL2) => {
                    setTranslationFallbacks(trns, lng, keyL2, l2.i18nKey)
                    _.each(l2.sub, (l3, keyL3) => {
                        setTranslationFallbacks(trns, lng, keyL3, l3.i18nKey)
                    })
                })
            })
        })
        config.translations = _.merge(config.translations, trns) // TODO check _.defaultsDeep
    }

    const updateConfig = data => {
        config.setup.scrollHintDelayMsec = _.isNumber(data.setup.scrollHintDelayMsec)
            ? data.setup.scrollHintDelayMsec
            : 1500
    }

    const getInitialData = () => {
        return getStructure().then(strc => {
            return getTranslations().then(trns => {
                addTranslations(trns)
                strc.translations = config.translations
                return strc
            })
        })
    }

    const getStructure = () => {
        if (config.structure) {
            return config.structure
        }
        return post('/structure')
            .then(res => {
                updateConfig(res.data)
                config.structure = generateStructure(res.data)
                console.log('DS:getStructure config.structure = ', config.structure)
                return config.structure
            })
            .catch(error => console.warn('DS:getStructure ERROR error.message = ', error.message))
    }
    this.getStructure = getStructure

    const getTranslations = () => {
        return post('/translations')
            .then(res => {
                config.translations = res.data // TODO merge
                return res.data
            })
            .catch(error => console.warn('DS:getTranslations ERROR error.message = ', error.message))
    }

    const generateStructure = raw => {
        const navigation = {}
        const routes = []
        // navigation
        _.each(raw.structure, (itemL1, keyL1) => {
            const ui = _.get(raw, `ui.nav.${keyL1}`) || {}
            const nav = (navigation[keyL1] = { ...itemL1, ...ui })
            nav.i18nKey = `nav.${keyL1}.label`
            nav.sub = {}
            // router
            const mainRoute = {
                path: keyL1,
                // name: key,
                // alias: `${key}/*`,
                props: true,
                params: {
                    mainKey: keyL1
                },
                meta: {
                    mainKey: keyL1,
                    subKey: null,
                    i18nKey: `nav.${keyL1}.label`
                },
                children: []
            }
            routes.push(mainRoute)

            _.each(itemL1.sub, (itemL2, keyL2) => {
                // navigation
                itemL2 = _.isPlainObject(itemL2) ? itemL2 : {}
                itemL2.i18nKey = `nav.${keyL1}.sub.${keyL2}.label`
                itemL2.circleNav = itemL2.circleNav !== false
                navigation[keyL1].sub[keyL2] = itemL2
                // router
                mainRoute.children.push({
                    path: keyL2,
                    props: true,
                    params: {
                        subKey: keyL2
                    },
                    meta: {
                        mainKey: keyL1,
                        subKey: keyL2,
                        i18nKey: `nav.${keyL1}.sub.${keyL2}.label`
                    }
                })
                // circle navigation
                itemL2.circleNav ? config.circleNav.push(`/${keyL1}/${keyL2}`) : null

                const subRoute = _.last(mainRoute.children)
                subRoute.children = []

                _.each(itemL2.sub, (itemL3, keyL3) => {
                    // navigation
                    itemL3 = _.isPlainObject(itemL3) ? itemL3 : {}
                    itemL3.i18nKey = `nav.${keyL1}.sub.${keyL2}.sub.${keyL3}.label`
                    itemL3.circleNav = itemL3.circleNav !== false
                    navigation[keyL1].sub[keyL2].sub[keyL3] = itemL3
                    // router
                    if (keyL3 !== '__0') {
                        subRoute.children.push({
                            path: keyL3,
                            props: true,
                            params: {
                                keyL3
                            },
                            meta: {
                                mainKey: keyL1,
                                subKey: keyL2,
                                keyL3,
                                i18nKey: `nav.${keyL1}.sub.${keyL2}.sub.${keyL3}.label`
                            }
                        })

                        // circle navigation
                        itemL3.circleNav ? config.circleNav.push(`/${keyL1}/${keyL2}/${keyL3}`) : null
                    }
                })
            })
        })

        return {
            navigation,
            router: {
                root: raw.router,
                routes
            },
            setup: raw.setup
        }
    }

    const sanitizeFilename = input => {
        const allowedEndings = {
            jpeg: true,
            jpg: true,
            png: true,
            gif: true
        }
        const regx = new RegExp('^[a-zA-Z0-9()_.-]+$', 'g')
        const fn = input.split('.')
        const postfix = fn.pop()
        let prefix = fn.length > 0 ? fn.join('-') : ''
        const isUsable = !allowedEndings[postfix.toLowerCase()] || prefix === '' ? false : true
        const isMd5ed = !regx.test(prefix)
        prefix = isMd5ed ? CryptoJS.MD5(prefix).toString() : prefix
        return {
            raw: input,
            prefix,
            postfix,
            processedName: prefix === '' ? postfix : `${prefix}.${postfix}`,
            isUsable,
            isMd5ed
        }
    }

    // cms / ck-editor 4
    const ckUploadFileRequest = ckEvt => {
        const upload = {}
        upload.base64 = ckEvt.data.fileLoader.data
        const cleaned = sanitizeFilename(ckEvt.data.fileLoader.file.name)
        if (!cleaned.isUsable) {
            window.alert(`Filetype, filename or ending "${cleaned.postfix}" not valid`)
            return Promise.resolve(resolved => ({}))
        }
        upload.fileName = cleaned.processedName
        upload.key = `${globals.getLocale()}.${globals.getFocusedKey()}`
        return post(config.uploadApi, upload)
            .then(res => {
                if (res.data.success === true) {
                    res.data.path = `${config.mediaApi}/${upload.key.split('.').join('/')}/${upload.fileName}`
                    res.data.previewPath = `${config.mediaApi}/${res.data.previewKey}/${upload.key
                        .split('.')
                        .join('/')}/${upload.fileName}`
                    res.data.key = upload.key
                }
                res.data.error = null
                return res.data
            })
            .catch(error => {
                console.warn('DS:getTranslations ERROR error.message = ', error.message)
                return {
                    success: false,
                    error: error.message
                }
            })
    }
    this.ckUploadFileRequest = ckUploadFileRequest

    const ckSaveChanges = async (silent = false) => {
        const saveData = {
            data: []
        }
        _.each(changedTranslations, (value, key) => {
            // extremely important! only send cleaned media paths to server!
            value = value.split(config.mediaApi).join('/media')
            saveData.data.push({
                key: `${key}`,
                value
            })
        })
        return post(config.saveApi, saveData)
            .then(res => {
                hardUpdateTranslations(globals.getLocale(), res.data)
                silent ? null : window.alert('Changes successfully saved')
                return { success: true }
            })
            .catch(evt => {
                window.alert(`Changes save error:\n${evt}`)
                return evt
            })
    }
    this.ckSaveChanges = ckSaveChanges

    // cms

    const cmsPublish = async () => {
        const res = await ckSaveChanges(true)
        if (res.success === true) {
            return post(config.pulishApi)
                .then(res => {
                    console.log('DS:cmsPublish res = ', res)
                    window.alert('Changes successfully published')
                    // globals.setCmsPublishFeedback({ success: true })
                })
                .catch(evt => {
                    console.warn('DS:cmsPublish ERROR = ', evt)
                    window.alert(`Changes publish error:\n${evt}`)
                    // globals.setCmsPublishFeedback({ success: false })
                    return evt
                })
        }
    }

    const cmsUpdateTranslations = async data => {
        // needed also with ck!
        const saveData = {
            data: []
        }
        const loc = globals.getLocale()
        _.each(data, (value, key) => {
            value = value.replace(/(?:\r\n|\r|\n)/g, '') // <br>
            value = value.replace(/>\s+</g, '><')
            if (base.cms && base.cms !== '/') {
                value = value.split(base.cms).join('/')
            }
            saveData.data.push({
                key: `${loc}.${key}`,
                value
            })
        })
        return post(config.saveApi, saveData)
            .then(res => {
                hardUpdateTranslations(globals.getLocale(), res.data)
            })
            .catch(evt => {
                console.warn('DS:cmsUpdateTranslations ERROR = ', evt)
                return evt
            })
    }

    const authenticate = async email => {
        return post(config.authApi, { email }).then(res => {
            if (globals.DEV_MODE) {
                if (res.data.success) {
                    // In dev mode, there is no need always to klick the mail confirmation
                    globals.setAdminToken(res.data.token)
                    cmsUpdateTranslations()
                } else {
                    window.alert('No valid access data')
                }
            }
        })
    }
    this.authenticate = authenticate

    const authenticationConfirm = async token => {
        return post(config.authConfirmApi).then(res => {
            if (res.data.success === true) {
                globals.setAdminToken(token)
            } else {
                globals.setAdminToken(null)
            }
        })
    }
    this.authenticationConfirm = authenticationConfirm

    const hardUpdateTranslations = (loc, trns) => {
        // Its needed to kill the complete language set here before !!
        config.translations[loc] = {}
        globals.getI18n().vm.messages[loc] = {}
        // write updates to locale:
        addTranslations(trns)
        globals.getI18n().setLocaleMessage(loc, config.translations[loc])
        globals.getI18n().locale = loc
    }

    const changedTranslations = {}

    const cmsUpdateTranslation = (trns, silent) => {
        const key = globals.getFocusedKey()
        const loc = globals.getLocale()
        trns = _.isString(trns) ? trns : changedTranslations[`${loc}.${key}`] || null
        silent = silent === true
        if (_.isString(key) && _.isString(trns)) {
            // different set here, key-as-string on changedTranslations vs.
            // _.set key as datastructure in config.translations !
            changedTranslations[`${loc}.${key}`] = trns
            if (!silent) {
                _.set(config.translations, `${loc}.${key}`, trns)
            }
        }
    }
    this.cmsUpdateTranslation = cmsUpdateTranslation

    // publix

    this.cmsPublish = cmsPublish
    this.getConfig = getConfig
    this.getTranslations = getTranslations
    this.getInitialData = () => getInitialData()
}

export default Datasource
