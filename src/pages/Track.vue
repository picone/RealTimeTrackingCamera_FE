<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-button type="success" @click="startTracking" v-show="!capturing" plain>继续捕捉</el-button>
                <el-button type="danger" @click="stopTracking" v-show="capturing" plain>暂停跟踪</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="danger" @click="selectTarget">重新选取目标</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <v-m-jpeg :frame="videoFrame">
                </v-m-jpeg>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import VMJpeg from '../components/VMJpeg.vue'
    import Dictionary from '../utils/dictionary'
    import config from '../config'

    export default{
        data() {
            return {
                ws: null,
                contour: null,
                videoFrame: null,
                capturing: false,
            };
        },
        components: {
            VMJpeg,
        },
        beforeMount: function() {
            var dict = new Dictionary();
            this.contour = dict.get('contour_image');
            // 没有轮廓,重新选择
            if (!this.contour) {
                this.$router.replace('/');
            }
        },
        mounted: function() {
            this.startTracking();
        },
        methods: {
            startTracking: function() {
                if (!this.contour) {
                    return;
                }
                var me = this;
                this.ws = new WebSocket(config.websocketHost + '/track');
                this.ws.onmessage = this.onWebsocketReceive;
                this.ws.onopen = function(){
                    var command = new proto.CommandRequest();
                    command.setCode(2);
                    command.setFrame(me.contour);
                    me.ws.send(command.serializeBinary());
                    me.capturing = true;
                };
            },
            stopTracking: function() {
                var command = new proto.CommandRequest();
                command.setCode(1);
                this.ws.send(command.serializeBinary());
                this.ws.close();
                this.ws = null;
                this.capturing = false;
            },
            onWebsocketReceive: function(e) {
                var reader = new FileReader();
                var me = this;
                reader.readAsArrayBuffer(e.data);
                reader.onload = () => {
                    var frame = proto.FrameResponse.deserializeBinary(reader.result);
                    if (frame.getType() == proto.FrameResponse.Type.VIDEO) {
                        me.videoFrame = frame.getFrame();
                    }
                };
            },
            selectTarget: function() {

            }
        },
    }
</script>
<style scoped>

</style>
