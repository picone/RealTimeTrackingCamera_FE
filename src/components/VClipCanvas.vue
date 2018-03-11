<template>
    <div>
        <el-row>
            <el-col>
                <img ref="background" id="background">
                <canvas ref="canvas" id="canvas" @mouseup="onMouseUp"
                        @mousedown="onMouseDown" @mousemove="onMouseMove">
                </canvas>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-button type="success" @click="emitCanvasFrame" plain>确定</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="danger" @click="setCanvasFrame" id="reset" plain>重置</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {bin2base64, base642bin} from '../utils/image'

    export default{
        props: ['frame', 'background'],
        data: function() {
            return {
                mouseDown: false,
                ctx: null,
                frameImageData: null,
            }
        },
        watch: {
            frame: function() {
                this.setCanvasFrame();
            },
            background: function () {
                this.$refs.background.src = bin2base64(this.background);
            }
        },
        mounted: function() {
            this.ctx = this.$refs.canvas.getContext('2d');
        },
        methods: {
            setCanvasFrame: function() {
                var img = new Image(), canvas = this.$refs.canvas, me = this;
                img.src = bin2base64(this.frame);
                img.onload = function() {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    me.ctx.drawImage(img, 0, 0);
                    me.frameImageData = me.ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
                };
            },
            emitCanvasFrame: function() {
                var canvas = this.$refs.canvas, maskImageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
                if (this.frameImageData.width != maskImageData.width || this.frameImageData.height != maskImageData.height) {
                    console.warn('canvas width or height changed');
                    return;
                }
                // 把没有剪裁的区域置透明
                for (var i = 0; i < maskImageData.data.length; i += 4) {
                    if (maskImageData.data[i + 3] != 0) {
                        this.frameImageData.data[i] = this.frameImageData.data[i + 1] = this.frameImageData.data[i + 2] = 255;
                        this.frameImageData.data[i + 3] = 255;
                    }
                }
                this.ctx.putImageData(this.frameImageData, 0, 0);
                this.$emit('select', base642bin(this.$refs.canvas.toDataURL('image/jpeg')));
            },
            onMouseDown: function(e) {
                e.preventDefault();
                this.mouseDown = true;
                var p = this.getRealCoordinate({x: e.offsetX, y: e.offsetY});
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
            },
            onMouseUp: function(e) {
                e.preventDefault();
                this.mouseDown = false;
                this.ctx.closePath();
                this.ctx.clip();
                this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
                this.ctx.restore();
            },
            onMouseMove: function(e) {
                e.preventDefault();
                if (this.mouseDown) {
                    // 多只手指按的话取最后一只按下的手指
                    if (e.changedTouches) {
                        e = e.changedTouches[e.changedTouches.length - 1];
                    }
                    var p = this.getRealCoordinate({x: e.offsetX, y: e.offsetY});
                    this.ctx.lineTo(p.x, p.y);
                }
            },
            getRealCoordinate(point) {
                var canvas = this.$refs.canvas, scale = canvas.width / canvas.offsetWidth;
                return {
                    x: point.x * scale,
                    y: point.y * scale,
                };
            }
        }
    }
</script>

<style scoped>
    #canvas {
        max-width: 100%;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
    #background {
        max-width: 100%;
        z-index: -1;
        position: absolute;
        left: 0;
        top: 0;
    }
    #reset {
        float: right;
    }
</style>
