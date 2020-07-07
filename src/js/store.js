import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        preloadActive: false,
        currentLoadingItemName: null,
        colorWorld: 'initial'
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
            console.log('STORE:setColorWord this.state.colorWorld = ', this.state.colorWorld)
        }
    }
})

export default store
