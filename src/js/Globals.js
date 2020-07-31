import Vue from 'vue'

function Globals() {
    const DEV_MODE = window.BASE_CONFIG && window.BASE_CONFIG.devMode === true
    this.DEV_MODE = DEV_MODE
    console.log('GLBL: DEV_MODE = ', DEV_MODE)
    //
    this.MOBILE_NAV_SWITCH = 760
    //
    // vue-router
    //
    let router = null

    const registerRouter = $router => {
        router = $router
    }
    this.registerRouter = registerRouter
    this.getRouter = () => router
    //
    // vue-store
    //
    let store = null

    const registerStore = $store => {
        store = $store
    }
    this.registerStore = registerStore
    this.getStore = () => store
    //
    // vue-i18n
    //
    let i18n = null

    const registerI18n = $i18n => {
        i18n = $i18n
    }
    this.registerI18n = registerI18n
    this.getLocale = () => i18n.locale
    this.getI18n = () => i18n
    //
    // eventbus
    //
    const eventBus = new Vue()
    this.eventBus = eventBus

    // route handling

    const getCurrentRouterPath = () => {
        if (router) {
            return {
                raw: router.history.current.path,
                keys: router.history.current.path.split('/').filter(el => el.length > 0)
            }
        }
        return { raw: null, keys: [] }
    }
    this.getCurrentRouterPath = getCurrentRouterPath

    this.isColorWorld = key => !_.isNil(datasource.getStructure().navigation[key])

    const getWorldColorKeys = () => ['initial', 'default', ...Object.keys(datasource.getStructure().navigation)]
    this.getWorldColorKeys = getWorldColorKeys
    // constants definitions
    //
    // set the corresponding css values in App.vue and/or in the theming!
    this.CONTENT_TRANSITION_FADE_OUT_MSEC = 100
    this.CONTENT_TRANSITION_FADE_IN_MSEC = 400

    this.MODAL_FULLSCREEN = 'modal-fullscreen'

    const CP = {
        DEFAULT: 'default'
    }

    const dimensions = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
    }

    const onResize = evt => {
        const prev = { ...dimensions }
        dimensions.innerWidth = evt.target.innerWidth
        dimensions.innerHeight = evt.target.innerHeight
        eventBus.$emit('windowResized', {
            prev,
            now: { ...dimensions },
            dWidth: evt.target.innerWidth - prev.innerWidth,
            dHeight: evt.target.innerHeight - prev.innerHeight
        })
    }

    window.addEventListener('resize', onResize)

    // ++++++++++++++++++++++++++++++++++++++++
    // +++++  helpaz you will love :-)
    // ++++++++++++++++++++++++++++++++++++++++

    const preloadStyles = (pl = {}) => {
        pl.mainSelector = _.isString(pl.mainSelector) ? pl.mainSelector : null
        pl.subKeys = _.isPlainObject(pl.subKeys) ? pl.subKeys : null
        pl.cssAttr = _.isString(pl.cssAttr) ? [pl.cssAttr] : pl.cssAttr
        pl.cssAttr = _.isArray(pl.cssAttr) ? pl.cssAttr : null
        if (pl.mainSelector && pl.subKeys && pl.cssAttr) {
            const conv = input => convertDegreesForGsap(convertRgbToRgba(input))
            const styles = {}
            _.each(getWorldColorKeys(), key => {
                styles[key] = {}
                _.each(pl.subKeys, (subSel, subKey) => {
                    _.each(pl.cssAttr, attr => {
                        styles[key][subKey] = conv($(`${pl.mainSelector}.${key}${subSel}`).css(attr))
                    })
                })
            })
            return styles
        }
        return null
    }

    this.preloadStyles = preloadStyles

    const getAttrFromCssContent = selector => {
        let str = $(selector).css('content')
        let data = {}
        if (typeof str === 'string' && str.substring(1, 2) === '{') {
            str = str.replace(/'/g, '"').slice(1, -1)
            str = str.split('\\').join('')
            data = JSON.parse(str)
        } else {
            console.warn('Something goes wrong in getAttrFromCssContent, selector & result is : ', selector, str)
        }
        return data
    }
    this.getAttrFromCssContent = getAttrFromCssContent

    const convertRgbToRgba = input => {
        const re = /(rgb)\(([0-9]+),\s+([0-9]+),\s+([0-9]+)/g
        const subst = 'rgba($2,$3,$4,1'
        return input.replace(re, subst)
    }
    this.convertRgbToRgba = convertRgbToRgba

    // this catches the gsap / webkit bug(?) e.g. 'linear-gradient(90deg, ...' won't work,
    // but the same with 'linear-gradient(to right, ...' does
    const convertDegreesForGsap = input => {
        const inOut = {
            '(45deg': '(to top right',
            '(90deg': '(to right',
            '(135deg': '(to bottom right',
            '(180deg': '(to bottom',
            '(225deg': '(to bottom left',
            '(270deg': '(to left',
            '(315deg': '(to top left',
            '(360deg': '(to top',
            '(0deg': '(to top'
        }
        _.each(inOut, (value, key) => {
            // console.log('obj:fc value, key = ',value, key)
            input = input.split(key).join(value)
        })
        return input
    }
    this.convertDegreesForGsap = convertDegreesForGsap

    const parseSvgAttributes = attr => {
        var res = {}
        for (var i in (attr = attr.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))) {
            var c = attr[i].match(/[\w\.\-]+/g)
            res[c.shift()] = c
        }
        return res
    }
    this.parseSvgAttributes = parseSvgAttributes

    // check webp ability

    this.WEBP_ENABLED = false

    const checkWebpEnabled = (feature, callback) => {
        const kTestImages = {
            lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
            lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
            alpha:
                'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
            animation:
                'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
        }
        const img = new Image()
        img.onload = () => {
            const result = img.width > 0 && img.height > 0
            callback(feature, result)
        }
        img.onerror = () => callback(feature, false)
        img.src = `data:image/webp;base64,${kTestImages[feature]}`
    }

    checkWebpEnabled('lossy', (feature, isSupported) => {
        this.WEBP_ENABLED = isSupported
    })

    // ++++++++++++++++++++++++++++++++++++++++
    // +++++ CMS handling
    // ++++++++++++++++++++++++++++++++++++++++

    let isCmsEditorActive = false
    let adminToken = null
    let adminTouched = false // TEST ON
    this.cmsEnabled = false

    this.getAdminToken = () => {
        console.log('GLB:getAdminToken adminToken = ', adminToken)
        return adminToken || null
    }

    this.setAdminToken = (token = null) => {
        adminToken = token
        console.log('GLB:setAdminToken token = ', token)
        if (adminToken) {
            setTimeout(() => {
                loadCms()
            }, 200)
        }
    }

    const onCmsEvent = (key, data = null) => {
        console.log('GLB:onCmsEvent key, data = ', key, data)
        switch (key) {
            case 'editor-started':
                isCmsEditorActive = true
                break
            case 'editor-stopped':
                isCmsEditorActive = false
                break
        }
        eventBus.$emit('cmsEvent', {
            key,
            data
        })
    }
    this.onCmsEvent = onCmsEvent

    const setCmsPublishFeedback = attr => {
        // add custom feedback / dialog here
    }
    this.setCmsPublishFeedback = setCmsPublishFeedback

    const requestAuthentication = () => {
        ckLoadState === 'not-loaded' ? eventBus.$emit('requestAuthentication') : null
    }

    const touchedAdmin = () => {
        if (!adminToken) {
            requestAuthentication()
        }
        adminTouched = true
    }
    this.touchedAdmin = touchedAdmin

    const defaultPageReady = () => {
        if (adminTouched) {
            requestAuthentication()
        }
        if (DEV_MODE) {
            const auth = () => requestAuthentication()
            document.onkeydown = e => {
                if (e.key) {
                    if (e.key.toLocaleUpperCase() === 'A') {
                        document.addEventListener('mouseup', auth)
                    }
                }
            }
            document.onkeyup = () => document.removeEventListener('mouseup', auth)
        }
    }
    this.defaultPageReady = defaultPageReady

    let ckLoadState = 'not-loaded'

    const loadCms = () => {
        if (ckLoadState === 'not-loaded') {
            ckLoadState = 'core-load-pending'
            this.getStore().dispatch('setPreloadActiveState', true)
            let scr = document.createElement('script')
            scr.setAttribute('src', datasource.getConfig().ckEditor)
            document.head.appendChild(scr)
            setCmsEnabledState(true)
            eventBus.$emit('cmsEvent', {
                key: 'cmsWillLoad'
            })
        }
    }

    const loadedNames = []
    const onCmsLoadState = obj => {
        console.log('GLB:onCmsLoadState ++++++ ckLoadState, p.-length = ', ckLoadState, obj.pending.length)
        console.log('GLB:onCmsLoadState obj.name = ', obj.name)
        console.log('GLB:onCmsLoadState obj = ', obj)
        let name = obj.name.split('/lib/ckeditor/')
        name = name[1] || name[0]
        loadedNames.push(name)
        this.getStore().dispatch('setCurrentLoadingItemName', name)
        // console.log('GLB:onCmsLoadState ckLoadState, obj.pending.length = ', ckLoadState, obj.pending.length)
        if (obj.pending.length === 0) {
            if (ckLoadState === 'core-load-pending') {
                const tryToContinue = () => {
                    console.log('GLB:onCmsLoadState:tryToContinue CKEDITOR is there = ', _.isFunction(CKEDITOR.inline))
                    if (_.isFunction(CKEDITOR.inline)) {
                        ckLoadState = 'addons-load-pending'
                        // CKEDITOR.disableAutoInline = false
                        CKEDITOR.inline('ck-init')
                        console.log('GLB:onCmsLoadState: #ck-init = ', $('#ck-init'))
                    } else {
                        setTimeout(tryToContinue, 500)
                    }
                }
                tryToContinue()
            }
            if (ckLoadState === 'addons-load-pending') {
                this.getStore().dispatch('setCurrentLoadingItemName', null)
                setTimeout(() => this.getStore().dispatch('setPreloadActiveState', false), 500)
                // this.getStore().dispatch('setPreloadActiveState', false)
                console.log('GLB: CMS loaded loadedNames = ', loadedNames)
                console.log('GLB: CMS loaded loadedNames = ', JSON.stringify(loadedNames))
                ckLoadState = 'loaded'
            }
        }
    }
    this.onCmsLoadState = onCmsLoadState

    const setCmsEnabledState = yes => {
        if (this.cmsEnabled && window.CKEDITOR) {
            initCkInstance(null)
            for (name in CKEDITOR.instances) {
                window.CKEDITOR.instances[name].destroy(true)
            }
        }
        this.cmsEnabled = yes === true
        eventBus.$emit('cmsEvent', {
            key: 'cmsEnabled',
            value: this.cmsEnabled
        })
        return this.cmsEnabled
    }

    const toggleCmsEnabledState = () => {
        //
        // TODO implement readonly url field, try to access field via javascript after on dialogDefinition event
        //
        // CKEDITOR.on('dialogDefinition', function (e) {
        //     var dialogName = e.data.name;
        //     var dialog = e.data.definition.dialog;
        //     dialog.on('show', function () {
        //         console.log('dialog ' + dialogName + ' opened. The width is ' + this.getSize().width + 'px.');
        //     });
        //     dialog.on('hide', function () {
        //         console.log('dialog ' + dialogName + ' closed.');
        //     });
        // });

        return setCmsEnabledState(!this.cmsEnabled)
    }
    this.toggleCmsEnabledState = toggleCmsEnabledState

    let ckFocused = null

    this.getFocusedKey = () => ckFocused || null
    this.setFocusedKey = (key = null) => (ckFocused = key)

    const initCkInstance = key => {
        if (!this.cmsEnabled) {
            return
        }

        CKEDITOR.disableAutoInline = true
        if (key !== this.getFocusedKey()) {
            datasource.cmsUpdateTranslation(null, false)
        }
        this.setFocusedKey(key)

        CKEDITOR.inline(this.getFocusedKey())

        // This shows the allowedContent
        // CKEDITOR.replace( key, {
        //     on: {
        //         instanceReady: function( evt ) {
        //             var allowedContent = evt.editor.filter.allowedContent;
        //             console.log( JSON.stringify( allowedContent, null, '\t' ) );
        //         }
        //     }
        // } );

        if (CKEDITOR.instances[key]) {
            CKEDITOR.instances[key].on('change', evt => {
                const data = evt.editor.getData()
                // evt.editor.name dont works!
                // on single page content, cktools has a problem to keep track with
                // key cange, so it stucks to the first instance set with the first key.
                // TODO evaluate problem
                // datasource.updateTranslation(null, evt.editor.name, data, true)
                //
                // ckFocused is workaround for this.
                datasource.cmsUpdateTranslation(data, true)
            })
        }
    }
    this.initCkInstance = initCkInstance

    // +++++++++++++ INIT

    const init = () => {
        setTimeout(() => {
            // loadCms() // TEST ON
        }, 100)
    }
    this.init = init

    // ++++++++++++++++++++++++++++++++++++++++

    let uidCnt = 0
    const getUid = () => `uid-${++uidCnt}`

    this.getUid = getUid
}
export default Globals
