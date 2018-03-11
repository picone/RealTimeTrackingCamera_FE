<template>
    <div>
        <img ref="img" id="m-jpeg-img">
    </div>
</template>
<script>
    import {bin2base64} from '../utils/image'

    export default{
        props: ['frame'],
        watch: {
            frame: function() {
                this.$refs.img.src = bin2base64(this.frame);
            }
        }
    }
</script>

<style scoped>
    #m-jpeg-img {
        max-width: 100%;
        max-height: 100%;
    }
</style>
