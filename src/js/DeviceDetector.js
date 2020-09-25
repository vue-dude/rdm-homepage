import BaseDetector from 'device-detector-js'
import { detect } from 'detect-browser'
const browser = detect()

console.log('obj:fc browser = ', browser)

function DeviceDetector() {
    const bd = new BaseDetector()
    let ua = navigator.userAgent
    const base = bd.parse(ua)
    // !! base dont delivers 100% relialable values, so firefox IOS is detected as safari ...
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

    let brw = device.client.name.toLowerCase()
    switch (true) {
        // detect firefox first, as there is NO firefox-like string in the user agent! :-)
        case ua.includes('gecko') && ua.includes('mozilla/5.0'):
            brw = 'firefox'
            break
        case brw.includes('safari'):
            brw = 'safari'
            break
        case brw.includes('chrome'):
            brw = 'chrome'
            break
        case brw.includes('opera'):
            brw = 'opera'
            break
        default:
            brw = ''
    }

    const getClass = name => {
        return classes[name.toLowerCase()] || ''
    }

    // classes: sh234 sw234 ios safari

    const vp = device.viewport
    const cls = []

    // cls.push('device')
    cls.push(`sc-h${vp.height}`)
    cls.push(`sc-w${vp.width}`)
    cls.push(`rt${vp.pixelRatio}`)
    // cls.push(brw)
    cls.push(getClass(device.os.name))
    cls.push(device.viewport.landscape ? 'landscape' : 'portrait')

    

    // if (vp.pixelRatio === 2) {
    //     if (vp.width === 834 && vp.height === 1194) {
    //         device.classes = 'm-pad'
    //     }
    // }

    // if (vp.pixelRatio === 3) {
    //     if (vp.width === 375 && vp.height === 812) {
    //         device.classes = 'i-phone-x'
    //     }
    // }

    // override until trustful dtection is complete:
    if (device.viewport.innerWidth < 760) {
        // device.classes = 'i-phone-x'
    }

    device.classes = cls.join(' ')

    console.log('DD: device = ', device)

    // ipad-pro-11 / mpad: w: 834, h: 1194, r: 2
    // landscape always false

    // const bd = new BaseDetector()
    // console.log('DD: bd.isToucheEnabled() = ',bd.isToucheEnabled(navigator.userAgent))
    // console.log('DD: bd.isDesktop() = ',bd.isDesktop())

    this.getDevice = () => device
}

export default DeviceDetector

// botParser: BotParser {parse: ƒ}
// clientParser: ClientParser {options: {…}, parse: ƒ}
// createDeviceObject: () => {…}
// deviceParser: ClientParser {parse: ƒ}
// hasAndroidMobileFragment: (userAgent) => {…}
// hasAndroidTabletFragment: (userAgent) => {…}
// isDesktop: (result, osFamily) => {…}
// isToucheEnabled: (userAgent) => {…}
// operatingSystemParser: OperatingSystemParser {options: {…}, parse: ƒ, parsePlatform: ƒ}
// options: {skipBotDetection: false, versionTruncation: 1}
// parse: (userAgent) => {…}
// usesMobileBrowser: (client) => {…}
// vendorFragmentParser: VendorFragmentParser {parse: ƒ}

// const iPadInfo() => {
//     if (window.screen.height / window.screen.width == 1024 / 768) {
//         // iPad, iPad 2, iPad Mini
//         if (window.devicePixelRatio == 1) {
//             return 'iPad 1, iPad 2, iPad Mini 1'
//         }
//         // iPad 3, 4, 5, Mini 2, Mini 3, Mini 4, Air, Air 2, Pro 9.7
//         else {
//             return 'iPad 3, iPad 4, iPad 5, iPad Air 1, iPad Air 2, iPad Mini 2, iPad Mini 3, iPad Mini 4, iPad Pro 9.7'
//         }
//     }
//     // iPad Pro 10.5
//     else if (window.screen.height / window.screen.width == 1112 / 834) {
//         return 'iPad Pro 10.5'
//     }
//     // iPad Pro 12.9, Pro 12.9 (2nd Gen)
//     else if (window.screen.height / window.screen.width == 1366 / 1024) {
//         return 'iPad Pro 12.9, Pro 12.9 (2nd Gen)'
//     }
//     // Not an ipad
//     else {
//         return 'Not an iPad'
//     }
// }
