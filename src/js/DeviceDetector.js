import BaseDetector from 'device-detector-js'

function DeviceDetector() {
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

    const classes = {
        opera: 'opera',
        ios: 'ios',
        android: 'android'
    }

    const getClass = name => {
        return classes[name.toLowerCase()] || ''
    }

    const vp = device.viewport
    const cls = []

    cls.push(`sc-h${vp.height}`)
    cls.push(`sc-w${vp.width}`)
    cls.push(`rt${vp.pixelRatio}`)
    cls.push(getClass(device.os.name))
    cls.push(device.viewport.landscape ? 'landscape' : 'portrait')

    device.classes = cls.join(' ')

    this.getDevice = () => device
}

export default DeviceDetector

