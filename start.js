const queue = [
    './config/setup.js',
    // './css/app.css.preload',
    // './app.js.preload',
    './lib/crypto-js/3.1.9-1/core.js',
    './lib/crypto-js/3.1.9-1/md5.js',
    './lib/lodash/lodash.min.js',
    './lib/jquery/jquery.3.4.1.min.js',
    './lib/jquery/jquery-ui.min.js',
    './lib/gsap.3.2.6/gsap.min.js',
    './lib/gsap.3.2.6/EasePack.min.js',
    './lib/gsap.3.2.6/MotionPathPlugin.min.js',
    './css/app.css',
    './app.js',
    // ck stuff (not needed on public/non-cms version)
    './config/ck-init.css'
].reverse()

const assign = {
    js: ['script', 'src'],
    css: ['link', 'href', ['rel', 'stylesheet']],
    js_pre: ['script', 'src', ['rel', 'preload'], ['as', 'script']],
    css_pre: ['link', 'href', ['rel', 'preload'], ['as', 'style']]
}

const loadNext = () => {
    if (queue.length) {
        let target = queue.pop().split('.')
        let ending = target.pop()
        let attrs = assign[ending]
        if (ending === 'preload') {
            ending = target.pop()
            attrs = assign[`${ending}_pre`]
        }
        attrs = [...attrs].reverse()
        target = `${target.join('.')}.${ending}`
        let elm = document.createElement(attrs.pop())
        elm.setAttribute(attrs.pop(), target)
        while (attrs.length) {
            const attr = attrs.pop()
            elm.setAttribute(attr[0], attr[1])
        }
        document.head.appendChild(elm)
        console.log('INDEX: elm load = ', elm)
        elm.onload = () => loadNext()
    }
}

loadNext()
