<template>
    <div>
        <vue-markdown :source="aboutText" id="markdown">
        </vue-markdown>
    </div>
</template>
<script>
    import VueMarkdown from 'vue-markdown';
    import readmeText from '../../README.md';

    export default {
        data () {
            return {
                'aboutText': readmeText,
            }
        },
        components: {
            VueMarkdown
        }
    }
</script>
<style soped>
    #markdown {
        margin: 16px;
    }
</style>
