// deployCk.js
//
// this script strips down the ckeditor full sources to the needed parts
// for faster deployment.
// Plugins, languages, skins added or changed in config also needs to be set here!
//
// terminal:
// cd <vue-rdm root folder>
// node deploy/deployCk.js
//

const fs = require('fs-extra')
const path = require('path')
const sourceRoot = path.resolve(__dirname, '../public/lib/ckeditor-all')
const targetRoot = path.resolve(__dirname, '../public/lib/ckeditor')

const core = [
    'core/loader.js',
    'core/ckeditor.js',
    //
    'core/event.js',
    'core/editor_basic.js',
    'core/env.js',
    'core/ckeditor_basic.js',
    'core/log.js',
    'core/dom.js',
    'core/tools.js',
    'core/dtd.js',
    'core/dom/event.js',
    'core/dom/domobject.js',
    'core/dom/node.js',
    'core/dom/window.js',
    'core/dom/document.js',
    'core/dom/nodelist.js',
    'core/dom/element.js',
    'core/dom/documentfragment.js',
    'core/dom/walker.js',
    'core/dom/range.js',
    'core/dom/iterator.js',
    'core/command.js',
    'core/ckeditor_base.js',
    'core/config.js',
    'core/filter.js',
    'core/focusmanager.js',
    'core/keystrokehandler.js',
    'core/lang.js',
    'core/scriptloader.js',
    'core/resourcemanager.js',
    'core/plugins.js',
    'core/ui.js',
    'core/editor.js',
    'core/htmlparser.js',
    'core/htmlparser/basicwriter.js',
    'core/htmlparser/node.js',
    'core/htmlparser/comment.js',
    'core/htmlparser/text.js',
    'core/htmlparser/cdata.js',
    'core/htmlparser/fragment.js',
    'core/htmlparser/filter.js',
    'core/htmldataprocessor.js',
    'core/htmlparser/element.js',
    'core/template.js',
    'core/creators/inline.js',
    'core/creators/themedui.js',
    'core/editable.js',
    'core/selection.js',
    'core/style.js',
    'core/promise.js',
    'core/selection/optimization.js',
    'core/dom/comment.js',
    'core/dom/elementpath.js',
    'core/dom/text.js',
    'core/dom/rangelist.js',
    'core/_bootstrap.js',
    'core/skin.js'
]

const plugins = [
    'dialogui',
    'about',
    'a11yhelp',
    'dialogadvtab',
    'basicstyles',
    'bidi',
    'blockquote',
    'button',
    'dialog',
    'toolbar',
    'notification',
    'panelbutton',
    'panel',
    'floatpanel',
    'colorbutton',
    'colordialog',
    'templates',
    'menu',
    'contextmenu',
    'clipboard',
    'div',
    'resize',
    'elementspath',
    'copyformatting',
    'enterkey',
    'entities',
    'popup',
    'filebrowser',
    'find',
    'filetools',
    'floatingspace',
    'horizontalrule',
    'fakeobjects',
    'richcombo',
    'htmlwriter',
    'listblock',
    'format',
    'indentblock',
    'image',
    'indentlist',
    'wysiwygarea',
    'forms',
    'liststyle',
    'font',
    'menubutton',
    'language',
    'justify',
    'indent',
    'link',
    'maximize',
    'newpage',
    'magicline',
    'pastetext',
    'pastetools',
    'pagebreak',
    'preview',
    'print',
    'save',
    'removeformat',
    'selectall',
    'showborders',
    'sourcearea',
    'list',
    'specialchar',
    'sourcedialog',
    'showblocks',
    'tab',
    'stylescombo',
    'table',
    'undo',
    'tabletools',
    'scayt',
    'widgetselection',
    'uploadimage',
    'tableselection',
    'wsc',
    'lineutils',
    'widget',
    'notificationaggregator',
    'uploadwidget'
]

let items = ['skins/Moono_blue', 'lang/en.js', 'styles.js', 'contents.css', 'ckeditor.js', 'config.js']
const languages = ['en']
items = [...items, ...core]
plugins.forEach(key => {
    items.push(`plugins/${key}/plugin.js`)
    items.push(`plugins/${key}/icons`)
    items.push(`plugins/${key}/templates`)
    items.push(`plugins/${key}/images`)
    items.push(`plugins/${key}/dialogs`)
    items.push(`plugins/${key}/skins`)
    items.push(`plugins/${key}/cursors`)
    items.push(`plugins/${key}/styles`)
    languages.forEach(lng => items.push(`plugins/${key}/lang/${lng}.js`))
})

items.forEach(item => {
    console.log('copy: item = ', item)
    try {
        fs.copySync(`${sourceRoot}/${item}`, `${targetRoot}/${item}`)
    } catch (error) {
        //
    }
})
