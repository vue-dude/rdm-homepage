<template>
    <div
        class="nav-item color-worlds"
        :class="uid"
        @mouseenter.prevent="onMouseEnter"
        @mouseleave.prevent="onMouseLeave"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
    >
        <div
            v-if="config.type === 'bubble'"
            class="item nav-bubble"
            :class="[{ selected: config.selected, 'load-style': initializing || !animationMode }, colorWorld]"
        >
            <Iconz v-if="config.icon" class="icon" :icon="config.icon" />
            <slot></slot>
            <span>
                <div
                    @focus="onFocus"
                    :contenteditable="cmsActive"
                    :id="config.i18nKey"
                    class="text-content"
                    v-html="$t(config.i18nKey)"
                ></div>
            </span>
        </div>
        <div
            v-if="config.type === 'box'"
            class="item nav-box"
            :class="[{ selected: config.selected, 'load-style': initializing || !animationMode }, colorWorld]"
        >
            <div
                @focus="onFocus"
                :contenteditable="cmsActive"
                :id="config.i18nKey"
                class="label"
                v-html="$t(config.i18nKey)"
            ></div>
        </div>
        <div v-if="initializing && animationMode" class="color-worlds hidden">
            <div v-for="key in worldColors" :key="key">
                <div class="item nav-bubble load-style" :class="key"></div>
                <div class="item nav-bubble load-style selected" :class="key"></div>
                <div class="item nav-bubble load-style hover" :class="key"></div>
                <div class="item nav-bubble load-style active" :class="key"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Iconz from '@/components/Iconz.vue'

export default {
    name: 'NavBubble',
    components: {
        Iconz
    },
    props: {
        config: Object,
        parent: String,
        cmsActive: Boolean
    },
    data() {
        return {
            // dev stuff
            animationMode: true, // false: the styles are directly set, for realtime design changes
            //
            isMouseDown: false,
            initializing: true,
            styles: {},
            colorWorld: this.$store.state.colorWorld,
            hoverBrightness: 1,
            uid: `uid-${globals.getUid()}` 
        }
    },
    mounted() {
        this.hoverBrightness = globals.getAttrFromCssContent(
            `.${this.parent} .nav-item.color-worlds .item.nav-bubble.load-style`
        ).hoverBrightness
        this.styles = globals.preloadStyles({
            mainSelector: `.${this.parent} .color-worlds .nav-bubble.load-style`,
            subKeys: {
                'bubble-inactive': '',
                'bubble-selected': '.selected',
                'bubble-hover': '.hover',
                'bubble-active': '.active'
            },
            cssAttr: ['background-image']
        })
        setTimeout(() => this.init(), 1)
    },
    computed: {
        configKey() {
            return this.config.key
        },
        selector() {
            return this.config.key ? `.${this.parent} .nav-item.${this.uid} .item` : null
        },
        bgDefault() {
            return this.config.selected
                ? this.styles[this.colorWorld]['bubble-selected']
                : this.styles[this.colorWorld]['bubble-inactive']
        },
        bgHover() {
            return this.styles[this.colorWorld]['bubble-hover']
        },
        bgClick() {
            return this.styles[this.colorWorld]['bubble-active']
        },
        worldColors() {
            return globals.getWorldColorKeys()
        }
    },
    watch: {
        'config.selected'(selected) {
            this.updateDefaultBackground({ smooth: true })
        },
        '$store.state.colorWorld'(colorWorld) {
            this.onColorWorldChange(colorWorld)
        }
    },
    methods: {
        onFocus() {
            this.cmsActive ? globals.initCkInstance(`${this.config.i18nKey}`) : null
        },
        init() {
            this.animationMode ? this.updateDefaultBackground() : null
            this.initializing = false
        },
        updateDefaultBackground(attr = {}) {
            if (this.selector) {
                gsap.killTweensOf(this.selector)
                gsap.to(this.selector, attr.smooth ? 0.5 : 0.2, {
                    backgroundImage: this.bgDefault
                })
            }
        },
        onMouseEnter() {
            if (this.config.hoverEnabled && this.selector && this.animationMode) {
                gsap.killTweensOf(this.selector)
                const brght = `brightness(${this.hoverBrightness})`
                const brght0 = `brightness(1)`
                const setBrightness = (brgth, delay, reset) => {
                    gsap.to(this.selector, delay, {
                        '-webkit-filter': brgth,
                        filter: brgth,
                        onComplete: () => (reset ? setBrightness('unset', 0) : null)
                    })
                }
                setBrightness(brght0, 0)
                gsap.to(this.selector, 0.1, {
                    '-webkit-filter': brght,
                    filter: brght,
                    onComplete: () => setBrightness(brght0, 0.5, true)
                })
                gsap.to(this.selector, 0.4, {
                    backgroundImage: this.bgHover
                })
            }
        },
        onMouseLeave() {
            if (this.selector) {
                gsap.killTweensOf(this.selector)
                gsap.to(this.selector, 0.5, {
                    '-webkit-filter': 'unset',
                    filter: 'unset',
                    backgroundImage: this.bgDefault
                })
            }
        },
        onMouseDown() {
            if (this.selector) {
                this.isMouseDown = true
                gsap.killTweensOf(this.selector)
                gsap.from(this.selector, 0.5, {
                    // TEST 2.5
                    'background-image': this.bgClick,
                    onComplete: () => this.updateDefaultBackground({ selected: this.config.selected })
                })
            }
        },
        onMouseUp() {
            if (this.selector && this.isMouseDown) {
                this.$emit('clicked')
            }
            this.isMouseDown = false
        },
        onColorWorldChange(colorWorld) {
            this.colorWorld = this.parent === 'navigator' ? colorWorld : this.config.worldKey
            if (this.selector) {
                gsap.killTweensOf(this.selector)
                gsap.to(this.selector, 0, {
                    backgroundImage: this.bgDefault
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
//
$size: 200px; /*Size of the circle */
// for info, use with @include bgx();
@mixin bgx() {
    shape-outside: radial-gradient(farthest-side at top left, transparent 100%, red 0);
    -webkit-shape-outside: radial-gradient(farthest-side at top left, transparent 100%, red 0);
}

@mixin circle($radius) {
    width: $radius * 2;
    height: $radius * 2;
    border-radius: $radius;
    &::before {
        content: '';
        height: 100%;
        width: 50%;
        float: left;
        shape-outside: polygon(
            0 0,
            100% 0,
            60% 4%,
            40% 10%,
            20% 20%,
            10% 28.2%,
            5% 34.4%,
            0 50%,
            5% 65.6%,
            10% 71.8%,
            20% 80%,
            40% 90%,
            60% 96%,
            100% 100%,
            0 100%
        );
    }
    > span::before {
        content: '';
        height: 100%;
        width: 50%;
        float: right;
        shape-outside: polygon(
            100% 0,
            0 0,
            40% 4%,
            60% 10%,
            80% 20%,
            90% 28.2%,
            95% 34.4%,
            100% 50%,
            95% 65.6%,
            90% 71.8%,
            80% 80%,
            60% 90%,
            40% 96%,
            0 100%,
            100% 100%
        );
    }
}

.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.icon {
    ::v-deep {
        .view {
            background-color: #1c596f;
        }
    }
}
.nav-item {
    ::v-deep {
        p {
            margin: 0;
        }
    }
    .hidden {
        // visibility: hidden;
        display: none;
    }
    .nav-bubble {
        border: 1px solid #fff;
        width: $size;
        height: $size;
        border-radius: 50%;
        font-size: 16px;
        overflow: hidden;
        cursor: pointer;
        @include circle($size/2);
        .iconz {
            position: absolute;
            margin: 0;
            padding-bottom: 50px;
        }
        .text-content {
            position: relative;
            padding-top: 60%;
            margin: 5px;
            text-align: center;
            color: #fff;
            color: black;
            font-weight: 800;
            font-size: 22px;
            line-height: 22px;
        }
    }
    .nav-box {
        border: 1px solid #fff;
        width: 300px;
        line-height: 50px;
        border-radius: 5px;
        background-color: #e3e6cf33;
        font-size: 16px;
        overflow: hidden;
        transition: all 0.5s ease;
        cursor: pointer;
        .iconz {
            position: absolute;
            margin: 0;
            padding-bottom: 50px;
        }

        .label {
            position: relative;
            margin: 4px;
            text-align: center;
            color: #fff;
            color: black;
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
        }
    }
}
</style>
