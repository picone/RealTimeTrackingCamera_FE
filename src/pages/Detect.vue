<template>
    <div>
        <el-row id="control-bar">
            <el-col :span="12">
                <el-button type="success" @click="startListenWebsocket" v-show="!capturing" plain>开始捕捉</el-button>
                <el-button type="danger" @click="stopListenWebsocket" v-show="capturing" plain>停止捕捉</el-button>
            </el-col>
            <el-col :span="12">
                <span id="capture-tip">请移动要捕捉的目标</span>
            </el-col>
        </el-row>
        <el-row v-show="capturing">
            <el-col>
                <v-m-jpeg :frame="videoFrame" id="video"></v-m-jpeg>
            </el-col>
        </el-row>
        <el-row v-show="!capturing">
            <el-col>
                <canvas ref="canvas" id="canvas"></canvas>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import config from '../config'
    import VMJpeg from '../components/VMJpeg.vue'
    import {frame2base64} from '../utils/image'
    require('../message/request_pb');
    require('../message/response_pb');

    export default{
        data() {
            return {
                ws: null,
                videoFrame: null,
                capturing: false,
            }
        },
        beforeDestroy() {
            if (this.ws) {
                this.ws.close();
            }
        },
        components: {
            VMJpeg,
        },
        methods: {
            startListenWebsocket: function() {
                this.capturing = true;
                this.ws = new WebSocket(config.websocketHost + '/detect');
                this.ws.onmessage = this.onWebsocketReceive;
            },
            stopListenWebsocket: function() {
                this.capturing = false;
                var command = new proto.CommandRequest();
                command.setCode(1);
                this.ws.send(command.serializeBinary());
            },
            onWebsocketReceive: function(e) {
                var reader = new FileReader();
                var me = this;
                reader.readAsArrayBuffer(e.data);
                reader.onload = () => {
                    var frame = proto.FrameResponse.deserializeBinary(reader.result);
                    if (frame.getType() == proto.FrameResponse.Type.VIDEO) {
                        me.videoFrame = frame.getFrame();
                    } else if(frame.getType() == proto.FrameResponse.Type.OUTLINE) {
                        var img = new Image(), canvas = me.$refs.canvas, ctx = canvas.getContext('2d');
                        img.src = frame2base64(frame.getFrame());
                        img.onload = function () {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            ctx.drawImage(img, 0, 0);
                        };
                    }
                };
            }
        }
    }
</script>

<style scoped>
    #control-bar {
        padding: 10px 20px 16px 20px;
    }
    #video {
        padding: 10px;
    }
    #canvas {
        max-width: 100%;
    }
    #capture-tip {
        color: darkgray;
        font-size: 20px;
        line-height: 40px;
    }
</style>
