<template>
    <el-menu class="el-menu-demo"
             mode="horizontal"
             router
             unique-opened
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
        <el-menu-item index="/">目标提取</el-menu-item>
        <el-menu-item index="/">目标追踪</el-menu-item>
        <el-menu-item index="/">实时视频</el-menu-item>
        <el-menu-item index="/about">关于</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }
</style>
