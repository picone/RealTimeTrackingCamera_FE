<template>
    <div id="app" class="container">
        <v-navigation></v-navigation>
        <router-view keep-alive transition="fade" transition-mode="out-in"></router-view>
    </div>
</template>

<script>
    import VNavigation from './components/VNavigation.vue'

    export default {
        components: {
            VNavigation
        }
    }
</script>

<style>
    .container {
        margin: 0 auto;
    }
    body{
        margin: 0;
        padding: 0;
    }
</style>
