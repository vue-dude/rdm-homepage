import BaseDetector from 'device-detector-js'

// TODO move the 768 to a singkle source of truth, before globals!!!
function DeviceHandler(store = null, SWITCH_WIDTH_MOBILE_PIX = 768) {
    const bd = new BaseDetector()
    let ua = navigator.userAgent
    const base = bd.parse(ua)
    // !! base don't delivers 100% relialable values, so firefox IOS is detected as safari ...
    const device = { ...base, classes: [], __browser: $.browser }
    device.viewport = {
        width: window.screen.width,
        height: window.screen.height,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        landscape: window.innerWidth >= window.innerHeight,
        touch: bd.isToucheEnabled(navigator.userAgent)
    }
    ua = ua.toLowerCase()
    device.raw = ua

    // TODO add text-size-adjust: 1XX% for high res small devices like iPad mini

    const getOS = () => {
        let res = ''
        let os = _.get(device, 'os.name') || ''
        os = os.toLowerCase()
        switch (os) {
            case 'android':
                return 'adr'
            case 'windows':
                return 'win'
            // NOTE: the user agent OS shows 'ios' on chrome,
            // but 'Mac version 10.15' on FF!
            case 'ios':
                return 'ios'
            case 'mac':
                // get infos from:
                // https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
                switch (vp.pixelRatio) {
                    case 2:
                    case 3:
                        const w = vp.width
                        const h = vp.height
                        switch (true) {
                            case w === 768 && h === 1024: // ipads, ipad pro  9.7
                            case w === 834 && h === 1194: // ipad pro
                            case w === 1024 && h === 1366: // ipad pro 12
                            case w === 834 && h === 1112: // iPad Pro 10.5
                            //
                            case w === 375 && h === 812: // iphone X
                            case w === 414 && h === 736: // iPhone 8 Plus
                            // iPhone 8, iPhone 6s Plus, iPhone 6 Plus, iPhone 7,
                            // iPhone 6s, iPhone 6
                            case w === 375 && h === 667:
                            case w === 320 && h === 568: // iPhone SE
                                // TODO: update future / missing iphone screen sizes here
                                return 'ios'
                        }
                }
                return 'osx'
        }
        return ''
    }

    const generateCssClasses = () => {
        const cls = []
        cls.push(getOS())
        cls.push(`sc-h${vp.height}`)
        cls.push(`sc-w${vp.width}`)
        cls.push(`rt${vp.pixelRatio}`)
        cls.push(device.viewport.landscape ? 'landscape' : 'portrait')
        return cls.join(' ')
    }

    const generateMobileProperties = () => {
        // const innerWidth = vp.width < vp.innerWidth ? vp.width : vp.innerWidth
        const innerWidth = vp.width < vp.innerWidth ? vp.innerHeight : vp.innerWidth
        const mobileDefault = {
            mediaWidth: SWITCH_WIDTH_MOBILE_PIX,
            isMobile: true
        }
        const engine = _.get(device, 'client.engine') || ''
        // const version = _.get(device, 'client.version') || ''
        // const engineVersion = _.get(device, 'client.engineVersion') || ''
        // const vers = engineVersion !== '' ? engineVersion : version
        // console.log('STORE:setDevice parseInt(engineVersion) = ', parseInt(engineVersion))
        if (device.realOS === 'win') {
            // the new edge-chromium has the engine 'blink' !
            if (engine.toLowerCase() === 'edge') {
                return mobileDefault
            }
        }
        // console.log('STORE:setDevice 1 vp.width = ', vp.width)
        switch (true) {
            case vp.innerHeight < 620: // not enough height for bubble nav
                return mobileDefault // enforces mobile version
            case vp.width === 834: // m-pad
            case vp.width === 1024: // i-pad pro 12
                return {
                    isMobile: false,
                    mediaWidth: vp.width
                }
        }
        // detect by content size, enforce mobile version
        switch (true) {
            case innerWidth <= SWITCH_WIDTH_MOBILE_PIX + 1:
                return mobileDefault
            case innerWidth <= 940:
                return {
                    isMobile: false,
                    mediaWidth: 940
                }
        }
        return {
            isMobile: false,
            mediaWidth: null
        }
    }

    const vp = device.viewport
    const mProps = generateMobileProperties()
    device.states = {
        classes: generateCssClasses(),
        os: getOS(),
        // os: 'ios', // TEST
        mediaTag: mProps.mediaWidth ? `media-width-${mProps.mediaWidth}` : '',
        isMobile: mProps.isMobile,
        innerHeight: vp.innerHeight,
        innerWidth: vp.innerWidth
    }
    // use it with vue store or with classic get-setup
    console.log('DH: device = ', device)
    console.log('DH: device.states = ', device.states)
    this.getDevice = () => device
    this.updateDevice = () => {
        store ? store.dispatch('updateDevice', device.states) : null
    }

    // this fixes the problem IOS sometimes dont recognizes a scrollable content right after start
    this.forceIosHackyRotationUpdate = () => {
        if (device.states.os === 'ios') {
            const states = { ...device.states }
            states.innerHeight = device.states.innerWidth
            states.innerWidth = device.states.innerHeight
            states.classes = ''
            store ? store.dispatch('updateDevice', states) : null
            setTimeout(() => {
                this.updateDevice()
            }, 1)
        }
    }
}

export default DeviceHandler
