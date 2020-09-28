<template>
    <div id="app">
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
    data() {
        return {
            itvl: null,
            itvlCnt: 0
        }
    },
    created() {
        // TODO move this into the device control class
        globals.eventBus.$on('windowResized', this.onWindowResized)
        window.onorientationchange = () => {
            this.updateDevice()
            this.itvlCnt = 5
            clearInterval(this.itvl)
            this.itvl = setInterval(() => {
                this.updateDevice()
                if (--itvlCnt < 1) {
                    clearInterval(this.itvl)
                }
            }, 2000)
        }
    },
    mounted() {
        this.updateDevice()
        setTimeout(() => {
            this.updateAppHeight(this.$store.state.innerHeight)
        }, 100)
    },
    methods: {
        onWindowResized(evt) {
            this.updateDevice()
        },
        updateDevice() {
            const device = new DeviceDetector(window).getDevice()
            this.$store.dispatch('setDevice', device)
        },
        updateAppHeight(height) {
            const yOffset = this.$store.state.isMobile ? 100 : 150
            const dy = this.$store.state.isMobile ? 50 : 30
            $('.default-view .content-container .content .layers .scroll-area').height(height - yOffset - dy)
            $('.default-view .content-container .content .layers .bg').height(height - yOffset - dy + 30)
            $('.default-view .mobile-navigator .scroll-area').height(height - yOffset - dy + 30)
        }
    },
    watch: {
        '$store.state.innerHeight'(height) {
            this.updateAppHeight(height)
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
