<template>
    <div class="mobile-navigator">
        <div
            v-if="useNativeMomentumScroll"
            ref="scrollarea"
            class="scroll-area"
            :class="[$store.state.mediaTag, $store.state.deviceClasses]"
        >
            <div class="box-container color-worlds background">
                <div class="world-box" v-for="(item, key) in items" :class="key" :key="key">
                    <div class="bg" :class="key" @click="onClickItem({ mainKey: null })"></div>
                    <div class="gravity" :class="key">
                        <NavItem
                            :key="key"
                            class="bubble"
                            :class="{
                                [item.key]: true,
                                suspend: false
                            }"
                            @clicked="onClickItem({ mainKey: key, subKey: null })"
                            :config="item"
                            parent="mobile-navigator"
                            :cmsActive="isCmsActive"
                        ></NavItem>
                    </div>
                    <div class="sub-items">
                        <NavItem
                            v-for="subitem in items[key].sub"
                            :key="subitem.key"
                            class="box"
                            @clicked="onClickItem({ mainKey: key, subKey: subitem.key })"
                            :config="subitem"
                            parent="mobile-navigator"
                            :cmsActive="isCmsActive"
                        ></NavItem>
                    </div>
                </div>
            </div>
        </div>
        <vue-custom-scrollbar
            v-else
            ref="scrollarea"
            class="scroll-area"
            :class="[$store.state.mediaTag, $store.state.deviceClasses]"
            scrollYMarginOffset="20px"
            :settings="scrConfig"
        >
            <div class="box-container color-worlds background">
                <div class="world-box" v-for="(item, key) in items" :class="key" :key="key">
                    <div class="bg" :class="key" @click="onClickItem({ mainKey: null })"></div>
                    <div class="gravity" :class="key">
                        <NavItem
                            :key="key"
                            class="bubble"
                            :class="{
                                [item.key]: true,
                                suspend: false
                            }"
                            @clicked="onClickItem({ mainKey: key, subKey: null })"
                            :config="item"
                            parent="mobile-navigator"
                            :cmsActive="isCmsActive"
                        ></NavItem>
                    </div>
                    <div class="sub-items">
                        <NavItem
                            v-for="subitem in items[key].sub"
                            :key="subitem.key"
                            class="box"
                            @clicked="onClickItem({ mainKey: key, subKey: subitem.key })"
                            :config="subitem"
                            parent="mobile-navigator"
                            :cmsActive="isCmsActive"
                        ></NavItem>
                    </div>
                </div>
            </div>
        </vue-custom-scrollbar>
    </div>
</template>

<script>
//
import vueCustomScrollbar from 'vue-custom-scrollbar'
//
import Iconz from '@/components/Iconz.vue'
import NavItem from '@/components/NavItem.vue'
import { scale, rotate, translate, compose, applyToPoint } from 'transformation-matrix'
import { SCALE, POS, POS_CORR, PATH_1, PATH_2 } from '@/js/AnimationData.js'

let MAIN_DEFAULT, SUB_DEFAULT

export default {
    name: 'Navigator',
    components: {
        NavItem,
        Iconz,
        vueCustomScrollbar
    },
    props: {
        config: Object,
        uKey: Number
    },
    data() {
        return {
            scrConfig: {
                suppressScrollX: true
            },
            // dev stuff
            fluidAnimation: true,
            //
            active: null,
            pathMain: null,
            pathAdd: null,
            pathSteps: 1000,
            selectedMain: null,
            selectedSub: null,
            subTimeout: null,
            items: {},
            subsToStag: 5,
            initialRoute: null,
            clickStack: [],
            clickTme: null,
            dyBorderUp: 0,
            dyBorderDn: 0,
            cKey: 0,
            resizeTme: null,
            suspend: false,
            suspendItem: {},
            lastNonSuspendKeys: {
                mainKey: null,
                subKey: null
            },
            beforeInit: true,
            microNavIconSource: null,
            tmeInitPositions: null,
            tmeBoxHeights: null
        }
    },
    created() {
        const home = datasource.getConfig().home
        MAIN_DEFAULT = home[0]
        SUB_DEFAULT = home[1]
        globals.eventBus.$on('windowResized', this.updateMobileNavState)
    },
    mounted: function() {
        this.updateMobileNavState()
    },
    watch: {
        config(now, prev) {
            this.updateMobileNavState()
        },
        $route(to, from) {
            const keys = globals.getCurrentRouterPath().keys
            this.updateSelected(keys[0], keys[1])
        }
    },
    computed: {
        useNativeMomentumScroll() {
            return this.$store.state.os === 'ios' || this.$store.state.os === 'adr'
        },
        sub() {
            if (this.selectedMain) {
                return this.items[this.selectedMain].sub
            }
            return {}
        },
        isCmsActive() {
            const cKey = this.cKey
            return globals.cmsEnabled
        }
    },
    methods: {
        update() {
            this.cKey = this.cKey > 1000 ? 1 : ++this.cKey
        },
        updateMobileNavState() {
            this.items = this.getMainNavigationByStructure(this.config)
            clearTimeout(this.tmeInitPositions)
            clearTimeout(this.tmeBoxHeights)
            this.tmeInitPositions = setTimeout(() => {
                this.initPositions()
            }, 10)

            this.tmeBoxHeights = setTimeout(() => {
                this.adjustWorldBoxHeights()
            }, 20)
            this.updateSelected()
        },
        onClickItem(evt) {
            if (evt.mainKey) {
                const subKey = evt.subKey || _.keys(this.items[evt.mainKey].sub)[0]
                this.requestRouteUpdate(evt.mainKey, subKey)
            }
            this.$emit('clickItem', evt)
        },
        requestRouteUpdate(mainKey, subKey = SUB_DEFAULT) {
            console.log('MNAV:requestRouteUpdate mainKey, subKey = ', mainKey, subKey)
            globals.eventBus.$emit('routeWillChange', { mainKey, subKey })
            if (subKey) {
                this.updateRouting(mainKey, subKey)
            }
        },
        updateRouting(main, sub) {
            sub = sub || SUB_DEFAULT
            const route = {
                path: `/${main}/${sub}` //,
                // data: { triggeredBy: 'mobile-navigator' }
            }
            this.$router.push(route.path).catch(err => null)
            this.$store.dispatch('setColorWord', main)
        },
        getMainNavigationByStructure(strc) {
            let cnt = 0
            const main = {}
            _.each(strc, (obj, key) => {
                if (obj.use !== false && obj.track !== null) {
                    const item = (main[key] = { ...obj })
                    item.type = 'bubble'
                    item.key = key
                    item.worldKey = key
                    item.track = _.isNumber(item.track) ? item.track : 1
                    item.scaleMin = SCALE[item.scaleMin] ? SCALE[item.scaleMin] : SCALE.ITEM_DEFAULT_MIN
                    item.selected = false
                    item.hoverEnabled = true
                    item.pos = POS[obj.pos]
                    item.sub = this.getSubNavigationByStructure(item.sub, item.worldKey)
                }
            })
            return main
        },
        getSubNavigationByStructure(strc, worldKey) {
            const sub = {}
            _.each(strc, (item, key) => {
                sub[key] = { ...item }
                sub[key].type = 'box'
                sub[key].key = key
                sub[key].worldKey = worldKey
                sub[key].selected = false
                sub[key].hoverEnabled = true
            })
            return sub
        },

        updateSelected() {
            const keys = globals.getCurrentRouterPath().keys
            _.each(this.items, item => {
                _.each(item.sub, sub => {
                    sub.selected = false
                })
            })
            if (this.items[keys[0]] && this.items[keys[0]].sub[keys[1]]) {
                this.items[keys[0]].sub[keys[1]].selected = true
            }
        },

        adjustMain(attr) {
            const target = `.mobile-navigator .gravity.${attr.key}`
            const item = this.items[attr.key]
            let tg = target
            gsap.killTweensOf(tg)
            gsap.set(tg, {
                scale: 0.7,
                transformOrigin: 'center',
                xPercent: -50,
                yPercent: -50
            })

            tg = `${target} .iconz`
            gsap.killTweensOf(tg)
            gsap.set(tg, {
                top: '-50px',
                scale: 0.5
            })

            tg = `${target} .text-content`
            gsap.killTweensOf(tg)
            gsap.set(tg, {
                'padding-top': `${item.labelOffsetPercentY}%` || null
            })
        },

        adjustWorldBoxHeights() {
            _.each(this.items, (item, key) => {
                const boxSel = `.mobile-navigator .world-box.${key}`
                const subSel = `${boxSel} .sub-items`
                const boxBgSel = `${boxSel} .bg`
                const worldBoxHeight = $(subSel).height() + 150
                $(boxSel).height(worldBoxHeight)
                const fc = 1 / 0.4
                $(boxBgSel).height(worldBoxHeight * fc)
            })
        },

        initPositions() {
            let cnt = 0
            _.each(this.items, (item, key) => {
                this.adjustMain({
                    key,
                    target: `.mobile-navigator .nav-item.bubble.${key}`,
                    scale: 0.5,
                    yPos: cnt++
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
//
@import '@/css/basics.scss';
//

.mobile-navigator {
    .background {
        margin: unset;
        padding: unset;
        position: unset;
        width: unset;
        height: unset;
        overflow: unset;
    }
    .scroll-area {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        // TODO seems to trigger momentum scroll before IOS 13, needs further evaluation
        -webkit-overflow-scrolling: touch;
    }

    .box-container {
        &.color-worlds.background .bg {
            opacity: 1;
            position: unset;
            min-width: unset;
            min-height: unset;
            transform: scaleX(1) scaleY(0.4);
            transform-origin: left top;
        }
        .world-box {
            width: calc(100vw - 20px);
            max-width: 860px;
            // border: 1px solid white;
            border-radius: 20px;
            display: block;
            position: relative;
            height: 250px;
            overflow: hidden;

            .gravity {
                position: absolute;
                width: 300px;
                height: 100px;
                // will-change: transform;
                left: 120px;
                top: 50px;
                z-index: 1;
            }

            .sub-items {
                top: 80px;
                left: 140px;
                padding: 0;
                position: absolute;
                .box {
                    margin-bottom: 5px;
                }
                ::v-deep {
                    .nav-item .nav-box {
                        width: calc(100vw - 200px);
                        max-width: 350px;
                        transition: none;
                    }
                }
            }
        }
    }
    .opacity-1 {
        opacity: 1 !important;
    }

    .icon {
        width: 75px;
        height: 200px;
        left: calc(50% + 25px);
        position: absolute;
        top: calc(100vh - 167px);
        transform: scale(0.8);
        .iconz {
            &.arrow,
            &.scroll,
            &.hand {
                position: absolute;
                opacity: 0;
                ::v-deep {
                    .view {
                        background-color: rgb(255, 255, 255);
                    }
                }
            }
            &.hand {
                left: 50px;
                top: -20px;
                transform: scale(0.8);
            }
            &.arrow {
                transform: scale(0.7);
                top: -40px;
            }
        }
    }
    .drag-handler {
        width: 50px;
        height: 50px;
        position: absolute;
        opacity: 0.3;
        visibility: hidden;
        &.pos {
            left: 50px;
            background-color: #9e2828;
        }
        &.arc {
            left: 200px;
            background-color: black;
        }
    }

    .paths {
        width: 400px;
        height: 420px;
        opacity: 0.4;
        position: absolute;
        display: block;
        border: 1px solid white;
        visibility: hidden;
    }

    .no-pointer-events {
        pointer-events: none;
        cursor: default;
    }

    .main-bubblez .ellipse {
        position: absolute;
        // border: 1px solid red;
        width: 360px;
        height: 400px;
        &.as-icon {
            position: absolute;
            transform: scale(0.5);
            top: -120px;
            left: -81px;
        }
    }

    //

    .bubble {
        cursor: pointer;
        position: absolute;
        //
        opacity: 1;
        transition: opacity 0.3s;
        &.suspend {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s;
        }
        &.opacity0 {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s;
        }
        //
        &.suspendItem {
            left: 70px;
            top: 100px;
            // scale and opacity processed by gsap!
            transform: scale(0.75);
            //
            ::v-deep {
                .nav-item.color-worlds.bubble.selected {
                    margin-top: -10px;
                }
                .item.nav-bubble.selected {
                    .iconz.icon {
                        transform: scale(0.7);
                        margin: 0px;
                        margin-top: -8px;
                    }
                }
            }
        }
    }

    .sub-nav {
        position: absolute;
        content: "{ 'dyBorderUp':50, 'dyBorderDn':40 }";
        $itemsDeltaTop: 50px;
        $itemsDeltaDown: 60px;
        $innerHeight: 400px;
        $radius: 500px;
        $borderHeight: 55px;
        top: 400px;
        left: -55px;
        //
        opacity: 1;
        transition: opacity 0.1s;
        &.suspend {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s;
        }
        //
        .border {
            left: 100px;
            position: absolute;
            height: $borderHeight;
            overflow: hidden;
            &.down {
                transform: scaleY(-1);
                content: "{ 'top':'#{$innerHeight - $borderHeight}' }";
                top: calc(100vh - 550px);
            }
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 62%, rgba(0, 0, 0, 0) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
            .bubble {
                cursor: none;
                position: unset;
                margin-left: -100px;
            }
        }

        ::v-deep {
            .nav-bubble {
                width: $radius;
                height: $radius;
                border-radius: $radius;
                // visibility: hidden;
            }
        }

        .circle-container {
            position: absolute;
            width: 410px;
            height: $radius;
            overflow: hidden;
            background: none;
            &.dn {
                top: -($radius - $innerHeight);
            }
        }
    }
}
</style>
