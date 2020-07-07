<template>
    <div class="default-view mobile">
        <div class="views">
            <Navigator :config="navigation" :uKey="uKey" />
            <div class="content-container">
                <Content :config="content" :class="{ opacity0: mobynav && canShowMobileNav }" :key="uKey"></Content>
                <SubNav class="sub-nav" :config="{}" @clickPath="onSubNavClickPath" />
            </div>
            <MobileNavigator
                :config="navigation"
                :uKey="uKey"
                :class="{ opacity0: !mobynav }"
                v-show="canShowMobileNav"
                @clickItem="onMobyNavClickItem"
            />
        </div>
        <CmsControls :config="cmsControlbar" @publish="onRequestPublish" />
        <CmsControls :config="cmsDialog" @done="onDialogFinished" />
        <div contenteditable="true" id="cke.disabled"></div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navigator from '@/components/Navigator.vue'
import MobileNavigator from '@/components/MobileNavigator.vue'
import SubNav from '@/components/SubNav.vue'
import Content from '@/components/Content.vue'
import CmsControls from '@/components/CmsControls.vue'
//
export default {
    name: 'default-view',
    data() {
        return {
            content: {
                label: 'mock-content'
            },
            cmsControlbar: {
                id: null
            },
            cmsDialog: {
                id: null // authentication
            },
            navigation: {},
            mobynav: false,
            canShowMobileNav: null,
            uKey: 1
        }
    },
    components: {
        Navigator,
        MobileNavigator,
        Content,
        CmsControls,
        SubNav
    },
    created() {
        globals.eventBus.$on('cmsEvent', this.onCmsEvent)
        globals.eventBus.$on('requestAuthentication', this.onRequestAuthentication)
        globals.eventBus.$on('windowResized', this.onWindowResized)
        this.updateMobileNavState()
        this.loadData()
    },
    mounted() {
        this.updateMobileNavState()
    },
    methods: {
        update() {
            this.uKey = this.uKey > 1000 ? 1 : ++this.uKey
        },
        updateMobileNavState() {
            this.canShowMobileNav = $(window).width() < globals.MOBILE_NAV_SWITCH
            this.mobynav = this.canShowMobileNav ? this.mobynav : false
        },
        onWindowResized(data) {
            this.updateMobileNavState()
        },
        onCmsEvent(evt) {
            switch (evt.key) {
                case 'editor-stopped':
                    return this.update()
                case 'publish':
                    return (this.cmsDialog.id = 'publish')
                case 'cmsWillLoad':
                    return (this.cmsControlbar.id = 'controlbar')
            }
        },
        onRequestAuthentication(evt) {
            this.cmsDialog.id = 'authentication'
            // this.cmsControlbar.id = 'controlbar'
        },
        onRequestPublish() {
            this.cmsDialog.id = 'publish'
        },
        onDialogFinished() {
            this.cmsDialog.id = null
        },
        onSubNavClickPath(evt) {
            this.mobynav = this.canShowMobileNav
        },
        onMobyNavClickItem(evt) {
            if (!evt.mainKey) {
                this.mobynav = false
            }
        },
        setNavigation(nav) {
            this.navigation = nav
        },
        async loadData() {
            const strc = await datasource.getStructure()
            this.setNavigation(strc.navigation)
            globals.defaultPageReady()
        }
    },
    watch: {
        'window.CKEDITOR'(now) {
            console.log('DP:watch window.CKEDITOR = ', now)
        },
        $route(to, from) {
            console.log('DP:watch route to, from = ', to, from)

            setTimeout(() => {
                this.mobynav = false
                console.log('DP:watch route this.mobynav= ', this.mobynav)
            }, 200)
        }
    }
}
</script>

<style lang="scss" scoped>
.opacity0 {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
.default-view {
    display: flex;
    justify-content: space-around;
    max-width: 1200px;
    height: 100vh;
    overflow: hidden;
    .views {
        display: flex;
        .mobile-navigator {
            width: calc(100vw - 20px);
            position: absolute;
            left: 10px;
            top: 60px;
            z-index: 1;
        }
        .navigator {
            position: relative;
            top: 20px;
            flex-shrink: 0;
            left: -35px;
            width: 260px;
            z-index: 10;
        }
        .content-container {
            position: relative;
            top: 70px;
            left: 30px;
            width: calc(100vw - 500px);
            max-width: 800px;
            @media (max-width: 940px) {
                // min-width: calc(100vw - 340px);
                min-width: unset;
                max-width: unset;
                width: calc(100vw - 336px);
            }
            .sub-nav {
                margin-top: 5px;
                margin-left: 5px;
                width: calc(100% + 0px);
            }
        }
    }
    @media (max-width: 760px) {
        &.mobile {
            .views {
                display: inline;
                .navigator {
                    width: 0;
                    height: 0;
                    // display: none;
                    visibility: hidden;
                    overflow: hidden;
                }
                .content-container {
                    position: absolute;
                    top: 60px;
                    left: 10px;
                    width: calc(100vw - 32px);
                    ::v-deep {
                        .content .layers {
                            .scroll-area {
                                // iPhone X
                                max-height: 490px;
                                margin-left: 20px;
                                width: calc(100% + 2px);
                            }
                            .bg {
                                max-height: 530px;
                            }
                        }
                    }
                    .sub-nav {
                        height: 53px;
                        margin-top: -12px;
                        margin-left: 0px;
                        width: calc(100% + 12px);
                        ::v-deep {
                            .inner {
                                position: absolute;
                                margin: 4px;
                                margin-left: 10px;
                                width: calc(100% - 100px);
                                .path {
                                    display: flex;
                                    min-height: 30px;
                                    margin-top: 20px;
                                    width: 100%;
                                    div {
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        max-width: 40ch;
                                        //
                                        font-size: 16px;
                                        line-height: 16px;
                                        height: 30px;
                                        &.sp {
                                            margin-left: 6px;
                                            margin-right: 6px;
                                            width: 8px;
                                        }
                                        @media (max-width: 550px) {
                                            max-width: 22ch;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
