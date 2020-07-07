<template>
    <div class="head-navigation">
        <div class="left" :class="{ logoShifted }" v-html="$t('head.title')"></div>
        <div class="right">
            <div class="logo" @click="toggleLogo" :class="{ logoShifted }">
                <div class="image"></div>
            </div>
            <div class="legal" :class="{ logoShifted }" v-html="right"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeadNavigation',
    data() {
        return {
            tx: 299,
            logoShifted: true
        }
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
        toggleLogo() {
            this.logoShifted = !this.logoShifted
        }
    }
}
</script>

<style lang="scss">
.head-navigation {
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
    @media (max-width: 760px) {
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
        width: calc(100vw - 200px);
        max-width: 320px;
        white-space: nowrap;
        &.logoShifted {
            width: calc(100vw - 65px);
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
            @media (max-width: 760px) {
                position: absolute;
                display: flex;
                left: 10px;
                top: 20px;
                max-width: calc(100vw - 172px);
                &.logoShifted {
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

            // TODO see top
            @media (max-width: 530px) {
                right: unset;
                transform: scale(0.85);
                transform-origin: right top;
                cursor: pointer;
                margin-right: 0px;
                transition: margin-right 200ms;
                &.logoShifted {
                    margin-right: -100px;
                    transition: margin-right 200ms;
                }
            }
            // TODO see top
            @media (max-width: 760px) {
                position: absolute;
                float: unset;
                right: 0px;
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
