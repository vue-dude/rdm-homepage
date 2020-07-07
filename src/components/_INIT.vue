<template>
    <div class="init-component"></div>
</template>

<script>
export default {
    name: 'INIT',
    components: {
        //
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
        console.log('C:created:')
    },
    mounted() {
        console.log('C:mounted:')
    },
    methods: {
        update() {
            this.uKey = this.uKey > 1000 ? 1 : ++this.uKey
        }
    },
    watch: {
        $route(to, from) {
            console.log('C:WATCH: route to, from = ', to, from)
        }
    },
    computed: {
        //
    }
}
</script>

<style lang="scss" scoped>
.init-component {
    background-color: red;
}
</style>
