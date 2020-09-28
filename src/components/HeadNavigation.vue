<template>
    <div class="head-navigation" :class="[$store.state.mediaTag]">
        <div
            class="left"
            :class="[{ 'logo-shifted': logoShifted }, $store.state.mediaTag]"
            @click="onClickHeadline"
            v-html="$t('head.title')"
        ></div>
        <div class="right">
            <div class="logo" :class="[{ 'logo-shifted': logoShifted }, $store.state.mediaTag]" @click="toggleLogo">
                <div class="image"></div>
            </div>
            <div class="legal" :class="[{ 'logo-shifted': logoShifted }, $store.state.mediaTag]" v-html="right"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeadNavigation',
    data() {
        return {
            tx: 299,
            logoShifted: true,
            logoShiftPix: null,
            logoLink: this.$t(`head.logoLink`)
        }
    },
    created() {
        globals.eventBus.$on('windowResized', this.onWindowResized)
    },
    mounted() {
        this.logoShiftPix = globals.getAttrFromCssContent('.head-navigation').logoShiftPix
    },
    beforeDetroy() {
        globals.eventBus.$off('windowResized', this.onWindowResized)
    },
    computed: {
        right() {
            const keyz = 'terms,sp,imprint,sp,privacy'.split(',')
            const trns = []
            _.each(keyz, key => {
                const i18n = this.$t(`head.${key}`)
                trns.push(`<a href='#/legal/${key}'>${i18n}</a>`)
            })
            return trns.join(' ')
        }
    },
    methods: {
        onClickHeadline() {
            const home = datasource.getConfig().home
            const path = `/${home[0]}/${home[1]}`
            this.$router.push(path).catch(err => null)
            this.$store.dispatch('setColorWord', home[0])
        },
        onWindowResized(evt) {
            this.logoShifted = evt.now.innerWidth < this.logoShiftPix
        },
        toggleLogo() {
            const link = () => window.open(this.logoLink, '_blank')
            const dim = globals.getDimensions()
            if (dim.innerWidth <= this.logoShiftPix) {
                if (!this.logoShifted) {
                    link()
                }
                this.logoShifted = !this.logoShifted
            } else {
                this.logoShifted = false
                link()
            }
        }
    }
}
</script>

<style lang="scss">
.head-navigation {
    //
    content: "{ 'logoShiftPix':530 }";
    //
    position: absolute;
    height: 24px;
    width: 100vw;
    line-height: 26px;
    font-size: 14px;
    font-weight: 500;
    //
    background-color: #1c4566;
    color: #7fa8b8;
    // TODO make this centralized and dynamic, due to length of translated texts!
    // @media (max-width: 769px) {
    &.media-width-768 {
        height: 48px;
    }
    a {
        color: #d5d5d5;
        text-decoration: none;
        &:hover {
            color: #e9f5ff;
        }
    }

    .left {
        float: left;
        margin-left: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        width: calc(100vw - 460px);
        white-space: nowrap;
        cursor: pointer;
        &.media-width-768 {
            width: calc(100vw - 190px);
            &.logo-shifted {
                width: calc(100vw - 60px);
            }
        }
    }

    .right {
        float: right;
        .legal {
            float: right;
            margin-right: 10px;
            cursor: pointer;
            // background-color: #074568;
            padding-right: 5px;
            border-radius: 5px;
            // TODO see top
            &.media-width-768 {
                position: absolute;
                display: flex;
                left: 10px;
                top: 20px;
                max-width: calc(100vw - 172px);
                &.logo-shifted {
                    max-width: calc(100vw - 72px);
                }
                a {
                    display: block;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 20ch;
                    margin-right: 3px;
                }
            }
        }
        .logo {
            float: right;
            width: 175px;
            height: 56px;
            background-color: #f9f9f1;
            border-radius: 0 0 0 10px;
            cursor: pointer;
            // TODO see top
            &.media-width-768 {
                position: absolute;
                float: unset;
                right: 0px;
                transform: scale(0.85);
                transform-origin: right top;
            }
            // TODO see top
            @media (max-width: 530px) {
                transform: scale(0.85);
                transform-origin: right top;
                margin-right: 0px;
                transition: margin-right 200ms;
                &.logo-shifted {
                    margin-right: -100px;
                    transition: margin-right 200ms;
                }
            }
            .image {
                position: absolute;
                $url: '../assets/mpdl-logo.png';
                background-image: url($url);
                background-repeat: no-repeat;
                background-size: contain;
                width: 160px;
                height: 60px;
                margin: 5px;
            }
        }
    }
}
</style>
