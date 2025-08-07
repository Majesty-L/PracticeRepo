<template>
  <scroll-view class="scroll-view">
    <!-- todo: 有三个难度可以切换查看，三个难度分别对应字、词、短句，每个难度有20个 -->
    <view class="level">
      <text>难度</text>
      <!-- todo: 有三个难度可以切换 -->
    </view>
    <!-- 难度对应的字词列表 -->
    <view class="item" v-for="item in list" :key="item.id">
      <text>{{ item.name }}</text>
      <!-- todo: 每个字词展示回答次数，成功失败情况，掌握情况，点击可以前往学习 -->
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// todo: 从数据库中获取所有字词，先简单实现成写死的常见字词20个
const list = ref([
  {
    id: 1,
    name: '苹果'
  }
])
</script>