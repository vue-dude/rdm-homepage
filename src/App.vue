<template>
    <div class="app" :class="[$store.state.deviceClasses]" @click="onClickApp">
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
import DeviceHandler from '@/js/DeviceHandler'

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
        $(document).on('touchmove', function(e) {
            globals.eventBus.$emit('app-touched')
        })
    },
    methods: {
        onClickApp(evt) {
            globals.eventBus.$emit('app-touched')
        },
        onWindowResized(evt) {
            this.updateDevice()
        },
        updateDevice() {
            new DeviceHandler(this.$store).updateDevice()
        },
        updateAppHeight() {
            let height = this.$store.state.innerHeight
            if (height > 1250 && !this.$store.state.isMobile) {
                height = 1250
            }
            const yOffset = this.$store.state.isMobile ? 100 : 150
            const dy = this.$store.state.isMobile ? 50 : 30
            $('.default-view .content-container .content .layers .scroll-area').height(height - yOffset - dy)
            $('.default-view .content-container .content .layers .bg').height(height - yOffset - dy + 30)
            $('.default-view .mobile-navigator .scroll-area').height(height - yOffset - dy + 30)
        },
        updateAppWidth(width) {
            const state = this.$store.state
            if (state.isMobile) {
                $('.default-view .content-container').width(state.innerWidth - 32)
            } else {
                $('.default-view .content-container').width('') // none-mobile situation driven by css
            }
        }
    },
    watch: {
        '$store.state.innerWidth'() {
            this.updateAppWidth()
            this.updateAppHeight()
        },
        '$store.state.innerHeight'(height) {
            this.updateAppHeight()
        },
        '$store.state.isMobile'() {
            this.updateAppWidth()
            this.updateAppHeight()
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
// TODO move this from goo to mpdl local
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,400;1,200;1,400&display=swap');

.app {
    // Nunito is the Avenir replacement for windows based clients
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    //
    font-family: 'Avenir', 'Nunito', Helvetica, Arial, sans-serif;
    &.ios,
    // in fact, Nunito looks a bit better than Avenir on IOS
    &.win {
        font-family: 'Nunito', Helvetica, Arial, sans-serif;
        letter-spacing: -0.02rem; // TODO optimize for different browsers
    }
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
