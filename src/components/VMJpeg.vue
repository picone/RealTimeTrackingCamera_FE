<template>
    <div>
        <img ref="img" id="m-jpeg-img">
    </div>
</template>
<script>
    export default{
        props: ['frame'],
        watch: {
            frame: function() {
                if (!this.frame) {
                    return;
                }
                var buffer = new Uint8Array(this.frame);
                var buffer_length = buffer.length;
                if (buffer_length < 4) {
                    return;
                }
                //MIME判断
                var mime;
                if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47) {
                    mime = 'image/png';
                } else if (buffer[0] == 0xFF && buffer[1] == 0xD8) {
                    mime = 'image/jpeg';
                } else if (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46) {
                    mime = 'image/gif';
                } else {
                    return;
                }
                var binary = '';
                for (var i = 0; i < buffer_length; i++) {
                    binary += String.fromCharCode(buffer[i]);
                }
                this.$refs.img.src = 'data:' + mime + ';base64,' + window.btoa(binary);
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
