import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        preloadActive: false,
        currentLoadingItemName: null,
        colorWorld: 'initial',
        device: {
            // classes 'e.g. sc-h1120 sc-w1792 rt2 firefox portrait'
        },
        mediaTag: '', // media-width-768,
        isMobile: false,
        innerHeight: 0,
        rKey: 0
    },
    actions: {
        setPreloadActiveState(context, yes) {
            this.state.preloadActive = yes
        },
        setCurrentLoadingItemName(context, name) {
            this.state.currentLoadingItemName = name || null
        },
        setColorWord(context, world) {
            this.state.colorWorld = globals.isColorWorld(world) ? world : 'default'
        },
        setDevice(context, device) {
            this.state.device = device || {}
            this.state.mediaTag = ''
            // TODO move all following into the device control class
            //
            const vp = device.viewport

            const setMediaTag = num => {
                this.state.mediaTag = `media-width-${num}`
                this.state.isMobile = num === 768
            }

            const setInnerHeight = num => (this.state.innerHeight = num)

            const innerWidth = vp.width < vp.innerWidth ? vp.width : vp.innerWidth
            setInnerHeight(vp.innerHeight)

            this.state.isMobile = false
            switch (true) {
                case vp.innerHeight < 620: // not enough height for bubble nav
                    return setMediaTag(768) // enforces mobile version               
                case vp.width === 834: // m-pad
                    return setMediaTag(vp.width)
                case vp.width === 1024: // i-pad pro 12
                    return setMediaTag(vp.width)
            }
            // detect by content size, enforce mobile version
            switch (true) {
                case innerWidth <= 769:
                    return setMediaTag(768) // !!! 768 NOT 769 here !!!
                case innerWidth <= 940:
                    return setMediaTag(940)
            }
            // TODO add force mediaTag 768 on largr devices, e.g. edge
        },
        orientationChanged(context) {
            this.state.rKey++
            if (this.state.rKey > 1000) {
                this.state.rKey = 0
            }
        }
    }
})

export default store
