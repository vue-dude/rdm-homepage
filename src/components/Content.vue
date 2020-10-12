<template>
    <div class="content color-worlds">
        <div v-if="initializing" class="color-worlds">
            <div v-for="key in worldColors" :key="key">
                <div class="scroll-handler load-style" :class="key"></div>
            </div>
        </div>
        <div class="layers" :class="[$store.state.deviceClasses]">
            <div class="bg" :class="[$store.state.colorWorld]"></div>
            <div v-if="useNativeMomentumScroll" class="scroll-area">
                <div
                    class="text"
                    :class="{ fadeIn: showContent, fadeOut: !showContent }"
                    :contenteditable="cmsEnabled"
                    :id="i18nKey"
                    v-html="translation"
                ></div>
            </div>
            <vue-custom-scrollbar v-else class="scroll-area" :settings="scrConfig" scrollYMarginOffset="20px">
                <div
                    @focus="onFocus"
                    :contenteditable="cmsEnabled"
                    :suppressScrollX="false"
                    :id="i18nKey"
                    class="text"
                    :class="{ fadeIn: showContent, fadeOut: !showContent }"
                    v-html="translation"
                ></div>
            </vue-custom-scrollbar>
        </div>
    </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'

export default {
    name: 'Content',
    components: {
        vueCustomScrollbar
    },
    props: {
        config: Object
    },
    data() {
        return {
            scrConfig: {
                suppressScrollX: true
            },
            i18nKey: '----',
            showContent: false,
            showDelay: 0,
            showTimeout: null,
            mainKey: null,
            subKey: null,
            uKey: 0,
            initializing: true,
            styles: {},
            colorWorld: this.$store.state.colorWorld
        }
    },
    created() {
        const keys = globals.getCurrentRouterPath().keys
        this.i18nKey = datasource.getValidI18nKey(`content.${keys.join('.')}`)
        globals.eventBus.$on('routeWillChange', this.onRouteWillChange)
        globals.eventBus.$on('cmsEvent', this.onCmsEvent)
    },
    mounted() {
        this.styles = globals.preloadStyles({
            mainSelector: '.color-worlds .scroll-handler.load-style',
            subKeys: {
                'scroll-handler': ''
            },
            cssAttr: ['background-color']
        })
        setTimeout(() => this.init(), 1)
    },
    watch: {
        $route(to, from) {
            const keys = globals.getCurrentRouterPath().keys
            setTimeout(() => {
                this.i18nKey = datasource.getValidI18nKey(`content.${keys.join('.')}`)
                $('.content .layers .scroll-area').scrollTop(0)
                this.showContent = true
            }, 150)
        },
        '$store.state.colorWorld'(colorWorld) {
            this.colorWorld = colorWorld
            this.onColorWorldChange(colorWorld)
        }
    },
    computed: {
        useNativeMomentumScroll() {
            return this.$store.state.os === 'ios' || this.$store.state.os === 'adr'
        },
        cmsEnabled() {
            const uKey = this.uKey
            return globals.cmsEnabled
        },
        translationKey() {
            return `${globals.getLocale()}.${this.i18nKey}`
        },
        translation() {
            let trns = this.$t(this.i18nKey)
            if (!_.isString(trns)) {
                trns = '---'
            }
            trns = datasource.updateMediaPaths(trns)
            return trns
        },
        worldColors() {
            return globals.getWorldColorKeys()
        }
    },
    methods: {
        init() {
            this.initializing = false
        },
        update() {
            this.uKey = this.uKey > 1000 ? 1 : ++this.uKey
        },
        onCmsEvent(evt) {
            switch (evt.key) {
                case 'cmsEnabled':
                    return this.update()
            }
        },
        onFocus() {
            globals.initCkInstance(this.i18nKey)
        },
        onRouteWillChange(args) {
            if (args.mainKey !== this.mainKey || args.subKey !== this.subKey) {
                this.mainKey = args.mainKey
                this.subKey = args.subKey
                clearTimeout(this.showTimeout)
                this.showContent = false
                if (args.subKey) {
                    this.showTimeout = setTimeout(() => {
                        this.showContent = true
                    }, 150)
                }
            }
        },
        onColorWorldChange(colorWorld) {
            // TODO find the magic selector in rdm.scss to directly target the ps__thumb* things
            if (this.styles[colorWorld]) {
                const sel = '.content .scroll-area'
                $(`${sel} .ps__thumb-x`).css('background-color', this.styles[colorWorld]['scroll-handler'])
                $(`${sel} .ps__thumb-y`).css('background-color', this.styles[colorWorld]['scroll-handler'])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/css/basics.scss';
.content {
    .load-style {
        height: 0px;
        opacity: 0;
    }
    .scroll-handler {
        // TEST ON
        width: 300px;
        height: 10px;
    }
    .layers {
        .scroll-area {
            position: absolute;
            width: calc(100% - 40px);
            margin: 20px;
            margin-left: 50px;
            left: 0px;
            top: 0px;
            z-index: 1;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: none;
            // TODO seems to trigger momentum scroll before IOS 13, needs further evaluation
            -webkit-overflow-scrolling: touch;
            .text {
                margin-right: 45px;
                &.fadeIn {
                    opacity: 1;
                    @include transition(opacity 0.8s);
                }
                &.fadeOut {
                    opacity: 0;
                    @include transition(opacity 0.01s);
                }
            }
        }
        .bg {
            width: calc(100% + 12px);
            // height: calc(100vh - 130px); // moved to device setup in rdm.scss
            left: 0px;
            top: 0px;
            background-color: white;
            border-radius: 10px;
        }
    }
}
</style>
