<template>
    <div>
        <el-row>
            <el-col>
                <img ref="background" id="background">
                <canvas ref="canvas"
                        id="canvas"
                        @mouseup="onMouseUp"
                        @mousedown="onMouseDown"
                        @mousemove="onMouseMove">
                </canvas>
            </el-col>
        </el-row>
        <el-row>
            <el-col>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {frame2base64} from '../utils/image'

    export default{
        props: ['frame', 'background'],
        data: function() {
            return {
                mouseDown: false,
                ctx: null,
            }
        },
        watch: {
            frame: function() {
                var img = new Image(), canvas = this.$refs.canvas, me = this;
                img.src = frame2base64(this.frame);
                img.onload = function () {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
//                    me.ctx.fillStyle = 'transparent';
//                    me.ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
//                    me.ctx.fillStyle = this.ctx.createPattern(img, 'no-repeat');
//                    me.ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight)
                    me.ctx.drawImage(img, 0, 0);
                };
            },
            background: function () {
                this.$refs.background.src = frame2base64(this.background);
            }
        },
        mounted: function() {
            this.ctx = this.$refs.canvas.getContext('2d');
        },
        methods: {
            onMouseDown: function(e) {
                e.preventDefault();
                this.mouseDown = true;
                var p = this.getRealCoordinate({x: e.offsetX, y: e.offsetY});
                this.ctx.save();
                this.ctx.fillStyle = 'green';
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
</style>
