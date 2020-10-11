import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        preloadActive: false,
        currentLoadingItemName: null,
        colorWorld: 'initial',
        deviceClasses: '',
        mediaTag: '', 
        os: '', 
        isMobile: false,
        innerWidth: 0,
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
        updateDevice(context, deviceStates) {
            this.state.deviceClasses = deviceStates.classes
            this.state.os = deviceStates.os
            this.state.mediaTag = deviceStates.mediaTag
            this.state.isMobile = deviceStates.isMobile
            this.state.innerWidth = deviceStates.innerWidth
            this.state.innerHeight = deviceStates.innerHeight
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
