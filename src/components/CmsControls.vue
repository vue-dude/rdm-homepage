<template>
    <div class="cms-controls">
        <div class="icontest hidden">
            <span class="ckmod_toolgroup">
                <a class="ckmod_button ckmod_button_off icon-on-off">
                    <Iconz class="icon" icon="on-off" />
                </a>
            </span>
        </div>
        <div class="control-bar" v-if="config.id === 'controlbar'">
            <div class="ckmod_2 ckmod_reset_all ckmod_chrome">
                <div class="ckmod_inner">
                    <div class="ckmod_top">
                        <span class="ckmod_toolbox">
                            <span class="ckmod_toolbar">
                                <span class="ckmod_toolbar_start"></span>
                                <span class="ckmod_toolgroup">
                                    <a class="ckmod_button ckmod_button_off icon-on-off" @click="toggleCmsEnabledState">
                                        <Iconz class="icon" :class="{ active: cmsEnabled }" icon="on-off" />
                                    </a>
                                </span>
                                <span class="ckmod_toolgroup">
                                    <a class="ckmod_button ckmod_button_off" @click="saveChanges">
                                        Save
                                    </a>
                                </span>
                                <span class="ckmod_toolgroup">
                                    <a class="ckmod_button ckmod_button_off" @click="$emit('publish')">Publish</a>
                                </span>
                                <span class="ckmod_toolbar_end"></span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog" v-if="config.id === 'authentication' || config.id === 'publish'">
            <div class="ckmod_reset_all ckmod_dialog_container ckmod_2 ckmod_editor_nav">
                <table class="ckmod_dialog ckmod_browser_webkit ckmod_hidpi ckmod_ltr">
                    <tbody>
                        <tr>
                            <td>
                                <div class="ckmod_dialog_body">
                                    <div class="ckmod_dialog_title">
                                        CMS Control Panel
                                    </div>
                                    <a class="ckmod_dialog_close_button" title="Close">
                                        <span class="ckmod_label">X</span>
                                    </a>
                                    <div class="ckmod_dialog_tabs">
                                        <a
                                            class="ckmod_dialog_tab ckmod_dialog_tab_selected"
                                            :id="config.id"
                                            hidefocus="true"
                                        >
                                            {{ tabLabel }}
                                        </a>
                                        <!-- <a class="ckmod_dialog_tab hidden" id="second" hidefocus="true">
                                            Second
                                        </a> -->
                                    </div>
                                    <table class="ckmod_dialog_contents">
                                        <tbody>
                                            <tr id="authentication" v-show="config.id === 'authentication'">
                                                <td class="ckmod_dialog_contents_body">
                                                    <div class="ckmod_dialog_ui_vbox ckmod_dialog_page_contents">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <div class="info" v-html="$t('ui.authInfo')"></div>
                                                                </tr>
                                                                <tr>
                                                                    <td class="ckmod_dialog_ui_vbox_child">
                                                                        <div class="ckmod_dialog_ui_text">
                                                                            <label
                                                                                class="ckmod_dialog_ui_labeled_label"
                                                                                for="authentication-email"
                                                                            >
                                                                                {{ $t('ui.inputEmailLabel') }}
                                                                            </label>
                                                                            <div
                                                                                class="ckmod_dialog_ui_labeled_content"
                                                                            >
                                                                                <div class="ckmod_dialog_ui_input_text">
                                                                                    <input
                                                                                        class="ckmod_dialog_ui_input_text"
                                                                                        id="authentication-email"
                                                                                        :placeholder="
                                                                                            $t(
                                                                                                'ui.inputEmailPlaceholder'
                                                                                            )
                                                                                        "
                                                                                        type="text"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr id="publish" v-show="config.id === 'publish'">
                                                <td class="ckmod_dialog_contents_body">
                                                    <div class="ckmod_dialog_ui_vbox ckmod_dialog_page_contents">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <div
                                                                        class="info"
                                                                        v-html="$t('ui.publishInfo')"
                                                                    ></div>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td class="ckmod_dialog_footer">
                                                    <!-- <div
                                                        class="ckmod_resizer ckmod_resizer_ltr hidden"
                                                        title="Drag to resize"
                                                    >
                                                        ◢
                                                    </div> -->
                                                    <table class="ckmod_dialog_ui_hbox ckmod_dialog_footer_buttons">
                                                        <tbody>
                                                            <tr class="ckmod_dialog_ui_hbox">
                                                                <td class="ckmod_dialog_ui_hbox_first">
                                                                    <a
                                                                        hidefocus="true"
                                                                        id="bt-cancel"
                                                                        class="ckmod_dialog_ui_button ckmod_dialog_ui_button_cancel"
                                                                    >
                                                                        <span class="ckmod_dialog_ui_button">
                                                                            {{ $t('ui.btCancel') }}
                                                                        </span>
                                                                    </a>
                                                                </td>
                                                                <td
                                                                    class="ckmod_dialog_ui_hbox_last"
                                                                    role="presentation"
                                                                >
                                                                    <a
                                                                        hidefocus="true"
                                                                        id="bt-send"
                                                                        class="ckmod_dialog_ui_button ckmod_dialog_ui_button_ok"
                                                                    >
                                                                        <span class="ckmod_dialog_ui_button">
                                                                            {{ okButtonLabel }}
                                                                        </span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
//
import Iconz from '@/components/Iconz.vue'
//
export default {
    name: 'CmsControls',
    components: {
        Iconz
    },
    props: {
        config: Object
    },
    data() {
        return {
            uKey: 0
        }
    },
    created() {
        globals.eventBus.$on('cmsEvent', this.onCmsEvent)
    },
    mounted() {
        this.initAuthenticationForm()
    },
    watch: {
        'config.id'(now) {
            switch (now) {
                case 'authentication':
                    return this.$nextTick(() => this.initAuthenticationForm())
                case 'publish':
                    return this.$nextTick(() => this.initPublishForm())
                case 'controlbar':
                    return this.update()
            }
        },
        deep: true
    },
    computed: {
        cmsEnabled() {
            const uKey = this.uKey
            return globals.cmsEnabled
        },
        tabLabel() {
            const key = `ui.cmsControlTab${_.upperFirst(this.config.id)}`
            return this.$t(key)
        },
        okButtonLabel() {
            return this.config.id === 'publish' ? this.$t('ui.btPublish') : this.$t('ui.btSend')
        }
    },
    methods: {
        onCmsEvent(evt) {
            switch (evt.key) {
                case 'cmsEnabled':
                    return this.update()
            }
        },
        update() {
            this.uKey = this.uKey > 1000 ? 1 : ++this.uKey
        },
        saveChanges() {
            datasource.ckSaveChanges()
        },
        publishChanges() {},
        toggleCmsEnabledState() {
            globals.toggleCmsEnabledState()
            this.update()
        },
        initAuthenticationForm() {
            $('.dialog #bt-send').one('click', () => {
                const email = $('#authentication input#authentication-email').val()
                datasource.authenticate(email)
                this.$emit('done')
            })
            this.setupCloseUiElements()
        },
        initPublishForm() {
            $('.dialog #bt-send').one('click', () => {
                datasource.cmsPublish()
                this.$emit('done')
            })
            this.setupCloseUiElements()
        },
        setupCloseUiElements() {
            $('.dialog #bt-cancel').one('click', () => {
                this.$emit('done')
            })
            $('.dialog .ckmod_dialog_close_button').one('click', () => {
                this.$emit('done')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
//
@import '@/css/basics.scss';
//
.cms-controls {
    .info {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #9898b4;
        margin-bottom: 5px;
    }
    .ckmod_dialog_ui_labeled_content {
        margin-top: 5px;
    }
    .hidden {
        display: none;
        visibility: hidden;
    }
    .icon-on-off {
        width: 20px;
        .iconz {
            cursor: pointer;
            position: fixed;
            background-color: unset;
            transform-origin: top left;
            @include scale(0.025);
            width: 800px;
            margin-top: -2px;
            &.icon {
                ::v-deep {
                    .view {
                        background-color: rgb(136, 136, 136);
                    }
                }
            }
            &.active {
                background-color: rgb(219, 255, 90);
                &.icon {
                    ::v-deep {
                        .view {
                            background-color: black;
                        }
                    }
                }
            }
        }
    }

    //
}
</style>
