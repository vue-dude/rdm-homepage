<template>
    <div class="preloader">
        <div class="overlay">
            <div class="pl">
                <div class="animation">
                    <svg
                        class="spinner"
                        width="174px"
                        height="174px"
                        viewBox="0 0 66 66"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            class="path"
                            fill="transparent"
                            stroke-width="5"
                            cx="33"
                            cy="33"
                            r="30"
                            stroke="url(#gradient)"
                        ></circle>
                        <linearGradient id="gradient">
                            <stop offset="50%" stop-color="#42d179" stop-opacity="1" />
                            <stop offset="65%" stop-color="#42d179" stop-opacity=".5" />
                            <stop offset="100%" stop-color="#42d179" stop-opacity="0" />
                        </linearGradient>
                        <svg
                            class="spinner-dot dot"
                            width="5px"
                            height="5px"
                            viewBox="0 0 66 66"
                            xmlns="http://www.w3.org/2000/svg"
                            x="37"
                            y="1.5"
                        >
                            <circle class="path" fill="#42d179" cx="33" cy="33" r="30"></circle>
                        </svg>
                    </svg>
                </div>
                <div class="info">{{ $store.state.currentLoadingItemName }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Preloader',
    props: {
        msg: String
    }
}
</script>

<style lang="scss">
//

.overlay {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.65);
    .pl {
        margin-top: -20%;
        .info {
            color: #b5d4ca;
            text-align: center;
            width: 100vw;
            margin-top: -40px;
            font-size: 14px;
            line-height: 14px;
            min-height: 14px;
        }
        .animation {
            width: 100vw;
            text-align: center;
            transform: scale(0.3);
            filter: hue-rotate(4deg) saturate(0.4);
            .spinner {
                animation: rotate 1.4s linear infinite;
                width: 174px;
                height: 174px;
                position: relative;
            }

            .spinner-dot {
                width: 274px;
                height: 274px;
                position: relative;
                top: 0;
            }

            @keyframes rotate {
                to {
                    transform: rotate(360deg);
                }
            }

            @-webkit-keyframes rotate {
                to {
                    -webkit-transform: rotate(360deg);
                }
            }

            @-moz-keyframes rotate {
                to {
                    transform: rotate(360deg);
                }
            }

            .path {
                stroke-dasharray: 170;
                stroke-dashoffset: 20;
            }
        }
    }
}
</style>
