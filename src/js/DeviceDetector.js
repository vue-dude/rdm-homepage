import BaseDetector from 'device-detector-js'

function DeviceDetector() {
    const bd = new BaseDetector()
    const base = bd.parse(navigator.userAgent)
    const device = { ...base, class: '' }
    device.viewport = {
        width: window.screen.width,
        height: window.screen.height,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        landscape: window.innerWidth >= window.innerHeight,
        touch: bd.isToucheEnabled(navigator.userAgent)
    }

    const vp = device.viewport

    if (vp.pixelRatio === 2) {
        if (vp.width === 834 && vp.height === 1194) {
            device.class = 'm-pad'
        }
    }

    if (vp.pixelRatio === 3) {
        if (vp.width === 375 && vp.height === 812) {
            device.class = 'i-phone-x'
        }
    }

    // override until trustful dtection is complete:
    if (device.viewport.innerWidth < 760) {
        device.class = 'i-phone-x'
    }

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
