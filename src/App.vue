<template>
    <div id="app" :key="$store.state.rKey">
        <div class="hidden">
            <div contenteditable="true" id="ck-init"></div>
        </div>
        <Background />
        <Preloader v-if="$store.state.preloadActive" />
        <div class="views">
            <head-navigation />
            <router-view class="router-view" />
        </div>
    </div>
</template>

<script>
import Background from '@/components/Background'
import HeadNavigation from '@/components/HeadNavigation'
import Preloader from '@/components/Preloader'
import DeviceDetector from '@/js/DeviceDetector'

export default {
    name: 'App',
    components: {
        Background,
        HeadNavigation,
        Preloader
    },
    created() {
        globals.eventBus.$on('windowResized', this.onWindowResized)

        window.onorientationchange = () => {
            // window.addEventListener('orientationchange', () => {
            this.updateDevice()
            // this.$router.go(null)
            // window.location = ''
            // setTimeout(() => {
            //     // window.location = window.location
            //     // this.$router.go('/')
            //     // window.location.reload
            //     // this.$router.go('/')
            //     // this.$store.dispatch('orientationChanged')
            // }, 4000)
        } //)
        this.updateDevice()
    },
    mounted() {
        this.updateDevice()
        setTimeout(() => {
            this.updateDevice()
        }, 2000)
    },
    methods: {
        onWindowResized(evt) {
            this.updateDevice()
        },
        updateDevice() {
            const device = new DeviceDetector(window).getDevice()
            console.log('APP:updateDevice device = ', device)
            this.$store.dispatch('setDevice', device)
        }
    }
}
</script>

<style lang="scss">
@import '@/css/basics.scss';
@import '@/css/rdm.scss';

body,
html {
    position: fixed;
    width: 100%;
    height: 100%;
}

html {
    background-color: black;
}

body {
    margin: 0;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.background {
    margin: 0;
    padding: 0;
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.preloader {
    position: absolute;
    z-index: 1000;
}

#hidden {
    position: absolute;
    visibility: hidden;
    width: 0px;
    height: 0px;
    overflow: hidden;
}
</style>
