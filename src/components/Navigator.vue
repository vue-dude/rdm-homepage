<template>
    <div class="navigator">
        <div class="sub-nav" :class="{ suspend, hidden: beforeInit, 'temp-hidden': hideSubnav }">
            <div class="border top">
                <NavItem class="bubble" :config="{ type: 'bubble' }" parent="navigator"></NavItem>
            </div>
            <div class="circle-container up">
                <div class="circle-container dn">
                    <div class="sub-items" @scroll="onScrollSub">
                        <div class="nav-box-blind"></div>
                        <NavItem
                            v-for="(item, key, index) in sub"
                            :key="item.key"
                            class="box"
                            :class="{ stag: index < subsToStag, 'no-stag': index >= subsToStag, [item.key]: true }"
                            @mouseup.native="triggerSub(key, true)"
                            :config="item"
                            parent="navigator"
                            :cmsActive="isCmsActive"
                        ></NavItem>
                        <div class="nav-box-blind dn"></div>
                    </div>
                </div>
            </div>
            <div class="border down">
                <NavItem class="bubble" :config="{ type: 'bubble' }" parent="navigator"></NavItem>
            </div>
        </div>
        <div class="main-bubblez" :class="{ suspend, opacity0: beforeInit }">
            <svg version="1.1" class="paths" id="paths">
                <ellipse
                    class="ellipse-main"
                    cx="0"
                    cy="0"
                    rx="120"
                    ry="75"
                    fill="red"
                    stroke="black"
                    transform="translate(190,220),rotate(-90)"
                />
                <ellipse
                    class="ellipse-add"
                    cx="0"
                    cy="0"
                    rx="140"
                    ry="75"
                    fill="yellow"
                    stroke="black"
                    transform="translate(143,206),rotate(250)"
                />
            </svg>
            <div class="ellipse real">
                <div class="gravity" :class="key" v-for="(item, key) in items" :key="key">
                    <NavItem
                        :key="key"
                        class="bubble"
                        :class="{
                            'no-pointer-events': item.selected && !isCmsActive,
                            [item.key]: true,
                            suspend: false,
                            selected: item.selected,
                            opacity0: beforeInit
                        }"
                        @clicked="pushToClickStack(key)"
                        :config="item"
                        parent="navigator"
                        :cmsActive="isCmsActive"
                    ></NavItem>
                </div>
            </div>
            <div class="gravity suspendItem">
                <NavItem
                    class="bubble suspendItem"
                    :class="{
                        'no-pointer-events': suspendItem.selected && !isCmsActive,
                        suspend: !suspend,
                        opacity0: beforeInit
                    }"
                    @clicked="triggerMain(lastNonSuspendKeys.mainKey, lastNonSuspendKeys.subKey)"
                    :config="suspendItem"
                    parent="navigator"
                    :cmsActive="isCmsActive"
                >
                    <div class="icon-target ellipse as-icon no-pointer-eventsXX"></div>
                </NavItem>
            </div>
        </div>
        <!-- always remove these handlers when no ned to adjust, they cause the navigation crash! -->
        <!-- <div class="drag-handler pos"></div>
        <div class="drag-handler arc"></div> -->

        <!-- TODO move this and the connected 'ScrollHint' handler to sub-component -->
        <div class="icon">
            <div class="arrow-shell">
                <Iconz class="arrow" icon="arrow-down" />
            </div>
            <Iconz class="scroll" icon="scroll-down" />
            <Iconz class="hand" icon="hand" />
        </div>
    </div>
</template>

<script>
//
import Iconz from '@/components/Iconz.vue'
import NavItem from '@/components/NavItem.vue'
import { scale, rotate, translate, compose, applyToPoint } from 'transformation-matrix'
import DeviceDetector from 'device-detector-js'
const deviceDetector = new DeviceDetector()
const device = deviceDetector.parse(navigator.userAgent)
const browser = device.client.name.toUpperCase()
import { SCALE, POS, POS_CORR, PATH_1, PATH_2 } from '@/js/AnimationData.js'

// TODO make a component from this scroll hint control class
const ScrollHint = function() {
    let tme = null
    const scroll = '.navigator .icon .scroll'
    const hand = '.navigator .icon .hand'
    const arrow = '.navigator .icon .arrow'
    const arrowShell = '.navigator .icon .arrow-shell'
    let animationIsRunning = false
    const animationRepeats = 4
    let cnt = 0
    // public
    this.showReducedAnimation = false
    //
    const resetTweens = () => {
        clearTimeout(tme)
        tme = null
        gsap.killTweensOf(hand)
        gsap.set(hand, {
            top: null,
            opacity: null
        })
        gsap.killTweensOf(scroll)
        gsap.set(scroll, {
            opacity: null
        })
        gsap.killTweensOf(arrow)
        gsap.set(arrow, {
            opacity: 0.2
        })
        gsap.killTweensOf(arrowShell)
        gsap.set(arrowShell, {
            opacity: 0
        })
    }

    this.mute = () => {
        animationIsRunning ? this.stop() : null
    }

    this.stop = () => {
        resetTweens()
        animationIsRunning = false
        cnt = 0
    }
    this.flash = () => {
        resetTweens()
        animationIsRunning = true

        if (this.showReducedAnimation) {
            //
            gsap.to(arrowShell, 1, {
                opacity: 1
            })
            //
            gsap.to(arrow, 1.5, {
                opacity: 0.55,
                yoyo: true,
                repeat: -1
            })
        } else {
            gsap.to(scroll, 1.3, {
                opacity: 0.7
            })
            gsap.to(scroll, 0.3, {
                opacity: 0,
                delay: 2.5
            })

            let delay = 0.9
            gsap.to(hand, 0.4, {
                delay,
                opacity: 0.7
            })
            delay += 0.2
            gsap.to(hand, 0.8, {
                delay,
                top: 30
            })
            delay += 1.4
            gsap.to(hand, 0.7, {
                delay,
                opacity: 0
            })

            //
            gsap.to(arrowShell, 1, {
                delay: 3,
                opacity: 1
            })
            //
            gsap.to(arrow, 1.5, {
                opacity: 0.55,
                yoyo: true,
                repeat: -1
            })

            if (++cnt < animationRepeats) {
                tme = setTimeout(() => {
                    gsap.to(arrowShell, 0.7, {
                        opacity: 0,
                        onComplete: () => this.flash()
                    })
                }, 7000)
            }
        }
    }
}
const scrollHint = new ScrollHint()

switch (browser) {
    case 'FIREFOX':
    case 'SAFARI':
        POS.LEFT = POS_CORR.LEFT
        POS.RIGHT = POS_CORR.RIGHT
}

let STP = [POS.TOP, POS.RIGHT, POS.DOWN, POS.LEFT]
const STEPS_DEFAULT = [...STP, ...STP, ...STP]
STP = [POS.SPC_A, POS.SPC_B, POS.SPC_C, POS.SPC_D]
const STEPS_SPECIAL = [...STP, ...STP, ...STP]

const MAIN_DEFAULT = 'structure' // TODO make this dynamic
const SUB_DEFAULT = 'overview' // TODO make this dynamic

export default {
    name: 'Navigator',
    components: {
        NavItem,
        Iconz
    },
    props: {
        config: Object,
        uKey: Number
    },
    data() {
        return {
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
            scrollHintTme: null,
            suspend: false,
            suspendItem: {},
            lastNonSuspendKeys: {
                mainKey: null,
                subKey: null
            },
            beforeInit: true,
            microNavIconSource: null,
            mobileNavEnabled: $(window).width() < globals.MOBILE_NAV_SWITCH,
            hideSubnav: false
        }
    },
    created() {
        this.suspendItem = {
            hoverEnabled: true,
            i18nKey: null,
            icon: null, //'tuccy',
            key: 'suspendItem',
            selected: false,
            sub: {},
            track: null,
            type: 'bubble'
        }
        globals.eventBus.$on('cmsEvent', this.update)
        globals.eventBus.$on('windowResized', this.onWindowResized)
    },
    mounted: function() {
        // JSON.parse(PATH_X) is for Safari SVG bugfix
        // TODO implement order up positioning via dyBorderUp
        this.dyBorderUp = globals.getAttrFromCssContent('.sub-nav').dyBorderUp
        this.dyBorderDn = globals.getAttrFromCssContent('.sub-nav').dyBorderDn
        this.pathMain = this.getPathFromSvg($('.ellipse-main'), JSON.parse(PATH_1))
        this.pathAdd = this.getPathFromSvg($('.ellipse-add'), JSON.parse(PATH_2))
        //
        return
        // below stuff for development
        $('.navigator .drag-handler.pos').draggable({
            drag: evt => {
                const $target = $('.ellipse-add')
                const attr = $target.attr('transform').split('rotate')
                $target.attr('transform', `translate(${evt.clientX} ${evt.clientY}),rotate${attr[1]}`)
            }
        })
        $('.navigator .drag-handler.arc').draggable({
            drag: evt => {
                const $target = $('.ellipse-add')
                const attr = $target.attr('transform').split('rotate')
                $target.attr('transform', `${attr[0]}rotate(${evt.clientX})`)
            }
        })
    },
    watch: {
        config(now, prev) {
            this.items = this.getMainNavigationByStructure(this.config)
            this.setMainHoversEnabled(true)
            const keys = globals.getCurrentRouterPath().keys
            this.initialRoute = {
                mainKey: keys[0],
                subKey: keys[1]
            }
            if (!this.lastNonSuspendKeys.mainKey) {
                this.lastNonSuspendKeys = { ...this.initialRoute }
            }
            this.initialRoute.isSuspendingRoute = false
            if (!this.items[this.initialRoute.mainKey]) {
                this.lastNonSuspendKeys = {
                    mainKey: MAIN_DEFAULT,
                    subKey: null
                }
                this.initialRoute.isSuspendingRoute = true
            }
            this.$nextTick(() => this.initPositions())
        },
        $route(to, from) {
            const keys = globals.getCurrentRouterPath().keys
            if (this.routeNeedsUpdate(keys)) {
                this.triggerMain(keys[0], keys[1])
            }
        }
    },
    computed: {
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
        onScrollSub(evt) {
            if (!scrollHint.showReducedAnimation) {
                scrollHint.showReducedAnimation = true
            }
            scrollHint.mute()
        },
        pushToClickStack(evt) {
            this.clickStack.push(evt)
            clearTimeout(this.clickTme)
            this.clickTme = setTimeout(() => {
                const key = this.clickStack.pop()
                this.clickStack = []
                this.triggerMain(key)
            }, 120)
        },
        getPathFromSvg($svg, path) {
            // This fixes Safari SVG problems
            // TODO find a better setup for this!
            if (browser === 'SAFARI' && _.isArray(path)) {
                return [...path, ...path, ...path, ...path]
            }
            path = $svg[0]
            const transforms = globals.parseSvgAttributes($svg.attr('transform'))
            const trns = {
                x: parseInt(transforms.translate[0], 10),
                y: parseInt(transforms.translate[1], 10)
            }
            const rad = parseInt(transforms.rotate[0], 10) * (Math.PI / 180)
            const p = []
            let i = 0
            while (i < this.pathSteps) {
                const point = path.getPointAtLength((i++ / this.pathSteps) * path.getTotalLength())
                p.push({ x: point.x, y: point.y })
            }
            const matrix = compose(translate(trns.x, trns.y), rotate(rad))
            _.each(p, (point, index) => {
                p[index] = applyToPoint(matrix, point)
                p[index] = { x: _.floor(p[index].x, 1000), y: _.floor(p[index].y, 1000) }
            })
            // get the output for the path data for AnimationData.js here!
            // console.log('getPathFromSvg: path = ', JSON.stringify(p))
            return [...p, ...p, ...p, ...p]
        },
        update() {
            this.cKey = this.cKey > 1000 ? 1 : ++this.cKey
        },
        routeNeedsUpdate(keys) {
            const diff = _.difference(keys, [this.selectedMain, this.selectedSub])
            const level3Detected = _.isString(keys[2])
            return level3Detected ? false : diff.length > 0 || keys.length < 2
        },
        onMouseMoveSub(evt) {
            //
        },
        onWindowResized(data) {
            const mobileNavEnabled = $(window).width() < globals.MOBILE_NAV_SWITCH
            const forceResize = !mobileNavEnabled && this.mobileNavEnabled === true
            if (!this.hideSubnav) {
                this.hideSubnav = forceResize
            }
            this.mobileNavEnabled = mobileNavEnabled
            if (forceResize) {
                setTimeout(() => {
                    this.rebuildSubNavigation({ subKey: this.selectedSub })
                }, 1500)
                setTimeout(() => {
                    this.hideSubnav = false
                }, 1550)
            }
            if (data.dHeight !== 0 || forceResize) {
                scrollHint.stop()
                clearTimeout(this.scrollHintTme)
                $('.navigator .border.down').attr('style', null)
                clearTimeout(this.resizeTme)
                this.resizeTme = setTimeout(() => {
                    this.rebuildSubNavigation({ subKey: this.selectedSub })
                }, 350)
            }
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
        getPath() {
            return this.pathMain
        },
        getRange(start, end, track, clockwise = false, addRound = false) {
            start > 1 ? start-- : null
            end = _.isNumber(end) ? end : start
            end < start ? end++ : null
            start /= 4
            end /= 4
            const source = track === 1 ? this.pathMain : this.pathAdd

            start = Math.floor(source.length * start)
            end = Math.floor(source.length * end)

            const getStart = () => (addRound ? start + source.length / 4 : start)
            const getEnd = () => (addRound ? end + source.length / 4 : end)

            const path = clockwise
                ? source.slice(start, getEnd() + 1)
                : source.slice(end, getStart() + this.pathSteps + 1).reverse()
            return path
        },
        setMainHoversEnabled(yes = true) {
            _.each(this.items, item => {
                item.hoverEnabled = yes ? (item.selected ? false : true) : false
            })
        },
        animateMain(attr) {
            //
            if (attr.specialAnimation || !_.isNumber(attr.end)) {
                return
            }
            //
            const target = `.navigator .nav-item.bubble.${attr.key}`
            const item = this.items[attr.key]

            attr.start = _.isNumber(attr.start) ? attr.start : 0
            attr.end = _.isNumber(attr.end) ? attr.end : attr.start
            item.pos = attr.end
            item.selected = attr.selected

            const pos = {
                start: attr.start,
                end: attr.end
            }

            const time = attr.addRound ? 1.5 : 1.2

            let tg = target
            gsap.killTweensOf(tg)
            gsap.to(tg, time, {
                motionPath: {
                    path: this.getRange(pos.start, pos.end, attr.track, attr.clockwise, attr.addRound),
                    curviness: 1
                },
                scale: attr.scale,
                ease: Expo.easeOut,
                transformOrigin: 'center',
                xPercent: -50,
                yPercent: -50
            })

            tg = `${target} .text-content`
            gsap.killTweensOf(tg)
            gsap.to(tg, 0.2, {
                opacity: attr.scale === SCALE.ITEM_MAX ? 1 : 0,
                'padding-top': `${item.labelOffsetPercentY}%` || null
            })

            const iconScaleSelected = SCALE.ICON_SELECTED * (item.iconScaleSelectedFc || 1)
            tg = `${target} .iconz`
            gsap.killTweensOf(tg)
            gsap.to(tg, 0.2, {
                top: attr.scale === SCALE.ITEM_MAX ? '-50px' : '-10px',
                scale: attr.scale === SCALE.ITEM_MAX ? iconScaleSelected : SCALE.ICON_UNSELECTED
            })
        },

        animateSub(args) {
            //
            const target = '.navigator .sub-items .nav-item.box'
            this.requestRouteUpdate(this.selectedMain, this.selectedSub)

            const afterBorderAnimation = () => {
                gsap.to($('.navigator .sub-items'), 0, {
                    opacity: 1
                })
                const speed = 0.2
                const stagDelay = 0.05
                gsap.from($(`.navigator ${target}.stag`), speed, {
                    opacity: 0,
                    y: 50,
                    ease: Expo.easeOut,
                    stagger: stagDelay,
                    onComplete: () => {
                        this.setMainHoversEnabled(true)
                        this.triggerSub(args.subKey, false)
                    }
                })

                gsap.from($(`.navigator ${target}.no-stag`), speed, {
                    opacity: 0,
                    y: 50,
                    ease: Expo.easeOut,
                    delay: stagDelay * this.subsToStag
                })
            }

            gsap.to($('.navigator .border.top'), 0.2, {
                opacity: 1,
                top: 0
            })

            const getSubHeightInfo = value => {
                let subHeight1 = $('.navigator .sub-items')
                    .children()
                    .toArray()
                    .reduce((height, element) => height + $(element).outerHeight(true), 0)

                let subHeight2 = parseInt($('.navigator .sub-items').height(), 10)

                console.log('NAV:getSubHeightInfo .navigator .sub-items height = ', $('.navigator .sub-items').height())

                return {
                    subHeight1,
                    subHeight2,
                    visibleSubHeight: subHeight1 < subHeight2 ? subHeight1 : subHeight2 + 20,
                    needScrolling: subHeight2 < subHeight1 - 15
                }
            }

            const subHeightInfo = getSubHeightInfo()

            console.log('NAV:animateSub subHeightInfo = ', subHeightInfo)

            let borderDownTarget = subHeightInfo.visibleSubHeight

            borderDownTarget += this.dyBorderDn

            const navHeight = $('.navigator').height()
            $('.navigator .sub-nav .sub-items').css('height', '')
            // TODO move hardcoded numberz here to CSS
            if (navHeight < 650) {
                borderDownTarget = 1000
                $('.navigator .sub-nav .sub-items').css('height', '100px')
            }

            gsap.to($('.navigator .border.down'), 0.3, {
                opacity: 1,
                top: borderDownTarget,
                ease: Expo.easeOut
            })

            gsap.delayedCall(0.1, afterBorderAnimation())
            clearTimeout(this.scrollHintTme)
            if (subHeightInfo.needScrolling) {
                this.scrollHintTme = setTimeout(
                    () => scrollHint.flash(),
                    datasource.getConfig().setup.scrollHintDelayMsec
                )
            }
        },

        rebuildSubNavigation(opts = {}) {
            // TODO: If the submnue of the current mainKey is already open,
            // skip the rebuild/animation action and just select the new subKey
            $('.navigator .sub-nav .sub-items').scrollTop(0)
            clearTimeout(this.subTimeout)
            const sub = this.selectedMain ? this.items[this.selectedMain].sub : {}
            _.each(sub, (item, key) => {
                item.selected = false
            })

            const top = parseInt(globals.getAttrFromCssContent('.navigator .border.down').top, 10)
            const args = {
                '.border.down': {
                    top
                },
                subKey: opts.subKey || SUB_DEFAULT
            }

            gsap.to($('.navigator .border.down'), 0.1, {
                opacity: 0,
                top: parseInt(args['.border.down'].top - 200, 10) / 2
            })

            const delay = _.isNumber(opts.delay) ? opts.delay : 250
            gsap.to($('.navigator .sub-items'), 0.1, {
                opacity: 0,
                onComplete: () => {
                    this.subTimeout = setTimeout(() => this.animateSub(args), delay)
                }
            })
        },

        getMoveSetup(mainKey, opts = {}) {
            const item = this.items[mainKey]
            const res = {
                clockwise: true,
                specialTargets: false,
                steps: 0,
                setupForActiveTrack: item.track,
                targets: {
                    [POS.TOP]: POS.TOP,
                    [POS.RIGHT]: POS.RIGHT,
                    [POS.LEFT]: POS.LEFT,
                    [POS.DOWN]: POS.DOWN
                }
            }
            if (item.track === 2) {
                res.clockwise = false
                res.targetsTrack1 = {
                    [POS.TOP]: POS.SPC_A,
                    [POS.RIGHT]: POS.SPC_B,
                    [POS.DOWN]: POS.SPC_C,
                    [POS.LEFT]: POS.SPC_D
                }
                res.targetsTrack2 = {
                    [POS.TOP]: POS.DOWN,
                    [POS.DOWN]: POS.TOP
                }
            } else {
                let s1 = STEPS_DEFAULT.indexOf(item.pos)
                res.steps = STEPS_DEFAULT.slice(s1).indexOf(POS.DOWN)
                res.clockwise = res.steps <= 2
                res.targetsTrack1 = {
                    [STEPS_DEFAULT[4]]: STEPS_DEFAULT[4 + res.steps], // TOP -> x
                    [STEPS_DEFAULT[5]]: STEPS_DEFAULT[5 + res.steps], // RIGHT -> x
                    [STEPS_DEFAULT[6]]: STEPS_DEFAULT[6 + res.steps], // DOWN -> x
                    [STEPS_DEFAULT[7]]: STEPS_DEFAULT[7 + res.steps] // LEFT -> x
                }
                if (s1 === -1) {
                    // case: was special item active
                    const offsetAssign = {
                        [POS.SPC_A]: 0,
                        [POS.SPC_B]: 1,
                        [POS.SPC_C]: 2,
                        [POS.SPC_D]: 3
                    }
                    const offset = offsetAssign[item.pos]
                    res.targetsTrack1 = {
                        [POS.SPC_A]: STEPS_DEFAULT[6 - offset],
                        [POS.SPC_B]: STEPS_DEFAULT[7 - offset],
                        [POS.SPC_C]: STEPS_DEFAULT[8 - offset],
                        [POS.SPC_D]: STEPS_DEFAULT[9 - offset]
                    }
                    res.clockwise = offset >= 2
                }
                res.targetsTrack2 = {
                    [POS.TOP]: null,
                    [POS.DOWN]: POS.TOP
                }
                if (opts.initial) {
                    res.targetsTrack2[POS.TOP] = POS.TOP
                }
            }
            return res
        },
        addSpecialAnimationData(data) {},

        animateSuspendTransition() {
            if (this.suspend) {
                const source1 = '.navigator .main-bubblez .ellipse.real .gravity'
                const target = '.navigator .icon-target'
                const $source = $(source1).clone()
                const mKey = this.lastNonSuspendKeys.mainKey
                $source.find('.opacity0').removeClass('opacity0')
                $(target).empty()
                $source.appendTo(target)
                $('.navigator .icon-target .text-content').remove()
                $('.navigator .ellipse.as-icon .nav-bubble.selected .iconz.icon').removeAttr('style')

                if (this.lastNonSuspendKeys.mainKey !== MAIN_DEFAULT) {
                    $(`.navigator .icon-target .gravity.${MAIN_DEFAULT}`).remove()
                }

                const sec = this.beforeInit ? 0 : 0.6
                gsap.to('.navigator .main-bubblez .ellipse.real', sec, {
                    scale: 0.5,
                    opacity: 0,
                    ease: Expo.easeOut,
                    transformOrigin: 'center'
                })
                gsap.set('.navigator .main-bubblez .bubble.suspendItem', {
                    scale: 0.7,
                    opacity: 1
                })
                gsap.from('.navigator .main-bubblez .bubble.suspendItem', 0.5, {
                    delay: 0.1,
                    scale: 0.5,
                    ease: Expo.easeOut,
                    transformOrigin: 'center'
                })
                gsap.from('.navigator .main-bubblez .bubble.suspendItem', 0.05, {
                    delay: 0.05,
                    opacity: 0
                })
            } else {
                gsap.to('.navigator .main-bubblez .ellipse.real', 0.7, {
                    delay: 0.2,
                    scale: 1,
                    opacity: 1,
                    ease: Expo.easeOut,
                    transformOrigin: 'center'
                })
                gsap.to('.navigator .main-bubblez .bubble.suspendItem', 0.3, {
                    scale: 0.2,
                    opacity: 0,
                    transformOrigin: 'center'
                })
                $('.navigator .icon-target .gravity').remove()
            }
        },

        setSuspendMode(yes, mainKey) {
            const animate = this.suspend !== yes
            this.suspend = yes
            this.$store.dispatch('setColorWord', mainKey)
            animate ? this.animateSuspendTransition() : null
        },

        // TODO refactor 'triggerMainForCapture' vs. 'triggerMain' against redundant code
        triggerMainForCapture(mainKey, subKey = null, initial = false) {
            clearTimeout(this.scrollHintTme)
            scrollHint.stop()
            subKey = subKey || _.keys(this.items[mainKey].sub)[0]
            const specialTrackWasSelected = this.selectedMain && this.items[this.selectedMain].track === 2
            const move = this.getMoveSetup(mainKey, { initial })
            const scaleMin = move.setupForActiveTrack === 1 ? SCALE.ITEM_DEFAULT_MIN : SCALE.ITEM_REDUCED_MIN
            this.selectedMain = mainKey
            this.selectedSub = subKey
            this.setMainHoversEnabled(false)
            this.$store.dispatch('setColorWord', mainKey)
            _.each(this.items, (item, key) => {
                const data = { key }
                data.track = item.track
                data.start = item.pos
                data.end = move.targetsTrack1[item.pos]
                data.scale = key === mainKey ? SCALE.ITEM_MAX : scaleMin
                data.clockwise = move.clockwise
                data.selected = mainKey === key
                if (item.track === 2) {
                    if (data.selected && specialTrackWasSelected) {
                        data.end = null
                    } else {
                        data.end = move.targetsTrack2[item.pos]
                        data.scale = data.selected ? SCALE.ITEM_MAX : SCALE.ITEM_SPECIAL_MIN
                    }
                }
                this.animateMain(data)
            })
        },

        triggerMain(mainKey, subKey = null, initial = false) {
            clearTimeout(this.scrollHintTme)
            scrollHint.stop()
            console.log('NAV:triggerMain mainKey, subKey = ', mainKey, subKey)
            if (!this.items[mainKey]) {
                this.setSuspendMode(true, mainKey)
                return this.requestRouteUpdate(mainKey, subKey)
            }
            if (this.suspend) {
                this.setSuspendMode(false, mainKey)
            }
            this.lastNonSuspendKeys = { mainKey, subKey }

            this.requestRouteUpdate(mainKey, subKey)
            if (!this.isCmsActive) {
                subKey = subKey || _.keys(this.items[mainKey].sub)[0]
                const specialTrackWasSelected = this.selectedMain && this.items[this.selectedMain].track === 2
                const move = this.getMoveSetup(mainKey, { initial })
                const scaleMin = move.setupForActiveTrack === 1 ? SCALE.ITEM_DEFAULT_MIN : SCALE.ITEM_REDUCED_MIN
                this.selectedMain = mainKey
                this.selectedSub = subKey
                this.setMainHoversEnabled(false)
                this.$store.dispatch('setColorWord', mainKey)
                _.each(this.items, (item, key) => {
                    const data = { key }
                    data.track = item.track
                    data.start = item.pos
                    data.end = move.targetsTrack1[item.pos]
                    data.scale = key === mainKey ? SCALE.ITEM_MAX : scaleMin
                    data.clockwise = move.clockwise
                    data.selected = mainKey === key
                    if (item.track === 2) {
                        if (data.selected && specialTrackWasSelected) {
                            data.end = null
                        } else {
                            data.end = move.targetsTrack2[item.pos]
                            data.scale = data.selected ? SCALE.ITEM_MAX : SCALE.ITEM_SPECIAL_MIN
                        }
                    }
                    if (data.selected) {
                        this.rebuildSubNavigation({ subKey })
                    }
                    this.animateMain(data)
                })
            }
        },

        updateRouting(main, sub) {
            sub = sub || SUB_DEFAULT
            const route = {
                path: `/${main}/${sub}`,
                data: { triggeredBy: 'navigator' }
            }
            this.$router.push(route.path).catch(err => null)
            this.$store.dispatch('setColorWord', main)
        },

        triggerSub(subKey, updateRoute) {
            this.lastNonSuspendKeys.subKey = subKey
            const sub = this.items[this.selectedMain].sub
            this.selectedSub = null
            _.each(sub, (item, key) => {
                item.selected = false
                if (key === subKey) {
                    item.selected = key === subKey
                    this.selectedSub = key
                }
            })
            updateRoute ? this.requestRouteUpdate(this.selectedMain, this.selectedSub) : null
        },

        requestRouteUpdate(mainKey, subKey) {
            globals.eventBus.$emit('routeWillChange', { mainKey, subKey })
            if (subKey) {
                this.updateRouting(mainKey, subKey)
            }
        },

        addFluidAnimation(item) {
            function Gravity(item) {
                const target = `.navigator .gravity.${item.key}`

                let piCnt1 = _.random(-60, 60)
                let piCnt2 = _.random(-60, 60)
                let piCnt3 = _.random(-60, 60)
                let piCnt4 = _.random(-60, 60)

                const animate = () => {
                    if (item.fluidEnabled) {
                        piCnt1++
                        piCnt2++
                        piCnt3++
                        piCnt4++
                        const x1 = Math.sin(Math.PI * 0.01 * piCnt1) * 3
                        const y1 = Math.cos(Math.PI * 0.02 * piCnt2) * 3
                        const x2 = Math.sin(Math.PI * 0.03 * piCnt3) * 2
                        const y2 = Math.cos(Math.PI * 0.04 * piCnt4) * 1

                        const x = (x1 + x2) * 0.6
                        const y = (y1 + y2) * 0.6

                        // if (browser === 'FIREFOX') {
                        //     // TODO find a smoother solution for FF here!
                        //     $(target).css({ left: x, top: y })
                        // } else {
                        //     const trns = `translate3d(${x}px,${y}px,0px)`
                        //     $(target).css({ '-webkit-transform': trns })
                        // }

                        const trns = `translate3d(${x}px,${y}px,0px)`
                        $(target).css({ '-webkit-transform': trns })
                        $(target).css({ transform: trns })
                    }

                    requestAnimationFrame(animate)
                }
                requestAnimationFrame(animate)
            }
            new Gravity(item)
        },
        setFluidEnabled() {
            this.suspendItem.fluidEnabled = true
            _.each(this.items, item => {
                item.fluidEnabled = true
            })
        },
        initPositions() {
            this.fluidAnimation ? this.setFluidEnabled() : null
            _.each(this.items, (item, key) => {
                this.fluidAnimation ? this.addFluidAnimation(item) : null
                const selected = item.pos === POS.DOWN
                if (selected && !this.initialRoute) {
                    this.selectedMain = key
                    this.rebuildSubNavigation()
                }
                this.animateMain({
                    key,
                    target: `.navigator .nav-item.bubble.${key}`,
                    start: item.pos,
                    track: item.track,
                    scale: selected ? SCALE.ITEM_MAX : item.scaleMin,
                    selected
                })
            })
            if (this.initialRoute) {
                if (this.initialRoute.isSuspendingRoute) {
                    gsap.delayedCall(0.1, () => {
                        this.triggerMainForCapture(MAIN_DEFAULT)
                    })
                    gsap.delayedCall(1, () => {
                        this.microNavIconSource = $('.navigator .main-bubblez .ellipse.real .gravity')
                        this.setSuspendMode(true)
                        this.beforeInit = false
                        this.selectedSub = null // triggers route update
                        this.requestRouteUpdate(this.initialRoute.mainKey, this.initialRoute.subKey)
                        this.initialRoute = null
                    })
                } else {
                    gsap.delayedCall(0.3, () => {
                        this.triggerMain(this.initialRoute.mainKey, this.initialRoute.subKey, true)
                        this.initialRoute = null
                    })
                    gsap.delayedCall(0.35, () => {
                        this.beforeInit = false
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
//
@import '@/css/basics.scss';
//
.navigator {
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

    .gravity {
        position: absolute;
        width: 300px;
        height: 1px;
        will-change: transform;
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
        &.temp-hidden {
            pointer-events: none;
            opacity: 0;
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

        .sub-items {
            top: $itemsDeltaTop + $radius - $innerHeight;
            height: calc(100vh - 610px);
            position: relative;
            left: 100px;
            width: 305px;
            overflow-y: scroll;
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
            mask-image: linear-gradient(
                to bottom,
                rgba(30, 87, 153, 0) 0%,
                rgba(30, 87, 153, 0.8) 15px,
                rgba(30, 87, 153, 1) 19%,
                rgba(30, 87, 153, 1) 20%,
                rgba(41, 137, 216, 1) 50%,
                rgba(30, 87, 153, 1) 80%,
                rgba(30, 87, 153, 1) 81%,
                rgba(30, 87, 153, 0.8) calc(100% - 15px),
                rgba(30, 87, 153, 0) 100%
            );
            .box {
                cursor: pointer;
                padding-bottom: 5px;
            }
            .nav-box-blind {
                width: 200px;
                height: 20px;
                &.dn {
                    height: 10px;
                }
            }
        }
    }
}
</style>
