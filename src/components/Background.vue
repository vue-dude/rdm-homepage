<template>
    <div class="background color-worlds">
        <div class="bg initial show"></div>
        <div v-if="!isMobile" class="coast-line" :class="[{ visible: showLandscape }, colorWorld]">
            <div class="shore p1" :class="colorWorld" />
            <div class="shore p2" />
            <div class="shore p3" />
        </div>
        <div v-if="!isMobile" class="lightpath" :class="[{ visible: showLandscape }, colorWorld]">
            <div class="tower">
                <div class="beam" :class="colorWorld" />
            </div>
        </div>
        <div v-if="initializing" class="color-worlds background">
            <div v-for="key in worldColors" :key="key">
                <div class="load-style bg" :class="key"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Background',
    props: {
        icon: String
    },
    data() {
        return {
            colorWorld: this.$store.state.colorWorld,
            styles: {},
            initializing: true,
            worldColors: globals.getWorldColorKeys(),
            showLandscape: false,
            uKey: 0
        }
    },
    mounted() {
        this.styles = globals.preloadStyles({
            mainSelector: '.color-worlds .background .load-style.bg',
            subKeys: {
                bg: ''
            },
            cssAttr: ['background-image']
        })
        this.initializing = false
        setTimeout(() => {
            this.showLandscape = true
            this.uKey++
        }, 1000)
    },
    watch: {
        '$store.state.colorWorld'(now, prev) {
            this.colorWorld = now
            const sel = '.background .bg.show'
            gsap.to(sel, 1.0, {
                'background-image': this.styles[now].bg
            })
        }
    },
    computed: {
        isMobile () {
            const uKey = this.uKey // triggers update
            return this.$store.state.isMobile
        }
    }
}
</script>

<style lang="scss" scoped>
//
.background {
    .load-style {
        height: 0px;
        opacity: 0;
    }
    .bg {
        width: 100vw;
        height: 100vh;
        min-width: 5000px;
        min-height: 4000px;
        position: absolute;
    }
    .lightpath {
        top: 180px;
        position: absolute;
        width: calc(100vw - 80px);
        max-width: 1500px;
        opacity: 0;
        &.visible {
            opacity: 1;
            transition: opacity 2.4s linear;
        }
        &.initial {
            filter: saturate(0);
        }
        .tower {
            // TODO make this centralized and dynamic, due to length of translated texts!
            @media (max-width: 530px) {
                display: none;
            }
            $url: '../assets/tower.png';
            background: url($url) no-repeat;
            position: absolute;
            transform: scale(0.75);
            width: 40px;
            height: 200px;
            top: 0px;
            left: calc(100% + 10px);
            .beam {
                width: 250px;
                height: 15px;
                position: absolute;
                right: 35px;
                top: 12px;
                outline: 1px solid transparent;
                transform: perspective(30px) rotateY(5deg);
                transform-origin: right;
            }
        }
    }
    .coast-line {
        position: absolute;
        transform-origin: top left;
        top: 180px;
        left: -20px;
        // transform: scaleX(0.5);
        transform: scaleY(2);
        opacity: 0;
        &.initial {
            filter: saturate(0);
        }
        &.visible {
            opacity: 1;
            transition: opacity 0.4s linear;
        }
        .shore {
            position: absolute;
            float: left;
            $url: '../assets/landscape-small.png';
            background: url($url) no-repeat;
            &.p1 {
                position: absolute;
                // width: 1000px;
                width: 500px;
                height: 202px;
                left: -50px;
                mask-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 1) 0px,
                    rgba(0, 0, 0, 1) 400px,
                    rgba(0, 0, 0, 0) 100%
                );
            }
            &.p2 {
                position: absolute;
                // left: 1400px;
                left: 700px;
                // width: 1700px;
                width: 850px;
                height: 202px;
                filter: contrast(150%) hue-rotate(50deg);
                opacity: 0.6;
                mask-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0) 0px,
                    black 100px,
                    black 500px,
                    rgba(0, 0, 0, 0) 100%
                );
            }
            &.p3 {
                position: absolute;
                // left: 2300px;
                left: 1150px;
                // width: 1600px;
                width: 800px;
                height: 202px;
                filter: contrast(150%) hue-rotate(50deg);
                opacity: 0.4;
                mask-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0) 0px,
                    black 100px,
                    black 500px,
                    rgba(0, 0, 0, 0) 100%
                );
            }
        }
    }
}
//
</style>
