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
        mediaTag: '', // media-width-768
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
            const vp = device.viewport
            const width = vp.width < vp.innerWidth ? vp.width: vp.innerWidth
            if (width <= 769) {
                this.state.mediaTag = 'media-width-768'
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
