CKEDITOR.editorConfig = function(config) {
    // config.filebrowserUploadUrl = 'https://127.0.0.1:3000/upload'
    config.filebrowserUploadUrl = datasource.getConfig().saveApi
    config.skin = 'Moono_blue' // ckeditor default skin
    config.defaultLanguage = 'en'
    config.language = 'en'
    var plugins = [
        'dialogui',
        'dialog',
        'about',
        'a11yhelp',
        'dialogadvtab',
        'basicstyles',
        'bidi',
        'blockquote',
        'notification',
        'button',
        'toolbar',
        'clipboard',
        'panelbutton',
        'panel',
        'floatpanel',
        'colorbutton',
        'colordialog',
        'templates',
        'menu',
        'contextmenu',
        'copyformatting',
        'div',
        'resize',
        'elementspath',
        'enterkey',
        'entities',
        'popup',
        'filebrowser',
        'filetools',
        'find',
        'fakeobjects',
        // 'flash',
        'floatingspace',
        'listblock',
        'richcombo',
        'font',
        'forms',
        'format',
        'horizontalrule',
        'htmlwriter',
        // 'iframe',
        'wysiwygarea',
        'image',
        'indent',
        'indentblock',
        'indentlist',
        // 'smiley',
        'justify',
        'menubutton',
        'language',
        'link',
        'list',
        'liststyle',
        'magicline',
        'maximize',
        'newpage',
        'pagebreak',
        'pastetext',
        'pastetools',
        // 'pastefromgdocs',
        // 'pastefromword',
        'preview',
        'print',
        'removeformat',
        'save',
        'selectall',
        'showblocks',
        'showborders',
        'sourcearea',
        'sourcedialog', // for inline
        'specialchar',
        'scayt',
        'stylescombo',
        'tab',
        'table',
        'tabletools',
        'tableselection',
        'undo',
        'lineutils',
        'widgetselection',
        'widget',
        'notificationaggregator',
        'uploadwidget',
        'uploadimage',
        'wsc'
    ]

    config.plugins = plugins.join(',')

    //   CKEDITOR.plugins.addExternal(
    // 	"filetools-rdm",
    // 	"./../../config/ckeditor/custom-plugins/filetools-rdm/"
    //   );

    console.log('CK-CONF:fc plugins = ', plugins)

    config.toolbar_ComplexVersion = [
        ['Source', 'Undo', 'Redo'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Image', 'Table', 'HorizontalRule', 'Sourcedialog'],
        ['NumberedList', 'BulletedList'],
        ['Outdent', 'Indent', 'Blockquote'],
        ['Link', 'Unlink'],
        ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'RemoveFormat'],
        ['Font'],
        ['FontSize'],
        ['Styles', 'RemoveFormat'],
        ['TextColor'],
        ['BGColor'],
        ['Maximize', 'ShowBlocks']
    ]

    //   config.toolbar_SimpleVersion = [
    //     ["Source"],
    //     ["Cut", "Copy", "Paste", "PasteText"],
    //     ["Bold", "Italic", "Underline", "Strike"],
    //     ["Styles"],
    //   ];

    config.toolbar = 'ComplexVersion'

    // toolbar:
    //         [
    //             [ 'Font', 'FontSize', 'TextColor' ],
    //             [ 'Bold', 'Italic', 'Underline', 'Strike' ],
    //             [ 'JustifyLeft', 'JustifyCenter' ],
    //             [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent' ],
    //             [ 'PasteText', 'PasteFromWord' ],
    //             [ 'Image', 'Table', 'HorizontalRule', 'SourceDialog' ]
    //         ]

    // config.allowedContent = 'p h1{text-align}; a[!href]; strong em; p(tip) article'

    config.stylesSet = [
        { name: 'Main Headline', element: 'div', attributes: { class: 'headline-main' } },
        { name: 'Sub Headline', element: 'div', attributes: { class: 'headline-sub' } },
        { name: 'Body Text', element: 'div', attributes: { class: 'body-text' } },
        { name: 'Body Teaser', element: 'div', attributes: { class: 'body-teaser' } },
        { name: 'Body Headline', element: 'div', attributes: { class: 'body-headline' } },
        { name: 'Body Link', element: 'span', attributes: { class: 'body-link' } },
        { name: 'Info Box', element: 'div', attributes: { class: 'info-box body-text' } },
        { name: 'Body Text Inline', element: 'span', attributes: { class: 'body-text' } },
        { name: 'Body Teaser Inline', element: 'span', attributes: { class: 'body-teaser' } },
        { name: 'Body Headline Inline', element: 'span', attributes: { class: 'body-headline' } }
        // { name: 'Distance 4px', element: 'div', attributes: { class: 'distance-4px' } }
    ]
}
