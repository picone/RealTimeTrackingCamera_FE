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
        <el-row v-show="capturing" class="capture">
            <el-col>
                <v-m-jpeg :frame="videoFrame"></v-m-jpeg>
            </el-col>
        </el-row>
        <el-row v-show="!capturing && outlineFrame" class="capture">
            <el-col>
                <v-clip-canvas :frame="outlineFrame" :background="backgroundFrame" @select="onOutlineSelect">
                </v-clip-canvas>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import config from '../config'
    import VMJpeg from '../components/VMJpeg.vue'
    import VClipCanvas from '../components/VClipCanvas.vue'
    import Dictionary from '../utils/dictionary'
    import {bin2base64} from '../utils/image'
    require('../message/request_pb');
    require('../message/response_pb');

    export default{
        data() {
            return {
                ws: null,
                videoFrame: null,
                outlineFrame: null,
                backgroundFrame: null,
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
            VClipCanvas,
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
                        me.outlineFrame = frame.getFrame();
                    } else if(frame.getType() == proto.FrameResponse.Type.BACKGROUND) {
                        me.backgroundFrame = frame.getFrame()
                    }
                    if (me.outlineFrame && me.backgroundFrame) {
                        me.ws.close();
                        me.ws = null;
                    }
                };
            },
            onOutlineSelect: function(img) {
                var dict = new Dictionary();
                dict.set('contour_image', img);
                this.$router.push('/track');
            },
        }
    }
</script>

<style scoped>
    #control-bar {
        padding: 10px 20px 16px 20px;
    }
    #canvas {
        max-width: 100%;
    }
    #capture-tip {
        color: darkgray;
        font-size: 20px;
        line-height: 40px;
    }
    .capture {
        padding: 10px;
    }
</style>
