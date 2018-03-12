<template>
    <div>

    </div>
</template>
<script>
    import Dictionary from '../utils/dictionary'
    import config from '../config'

    export default{
        data() {
            return {
                ws: null,
                contour: null,
            };
        },
        mounted: function() {
            var dict = new Dictionary();
            this.contour = dict.get('contour_image');
            // 没有轮廓,重新选择
            if (!this.contour) {
                this.$router.push('/');
            } else {
                this.startListenWebSocket();
            }
        },
        methods: {
            startListenWebSocket: function() {
                this.ws = new WebSocket(config.websocketHost + '/track');
                this.ws.onmessage = this.onWebsocketReceive;
                var command = new proto.CommandRequest();
                command.setCode(2);
                command.setFrame(this.contour);
                this.ws.send(command.serializeBinary());
            },
            stopListenWebSocket: function() {
                var command = new proto.CommandRequest();
                command.setCode(1);
                this.ws.send(command.serializeBinary());
            },
            onWebsocketReceive: function(e) {

            },
        },
    }
</script>
<style scoped>

</style>
