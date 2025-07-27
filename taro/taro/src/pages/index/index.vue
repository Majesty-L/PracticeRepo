<template>
  <view class="index">
    <Counter />
    <!-- 在首页添加跳转按钮 -->
    <button @tap="goToUserProfile" class="nav-btn">跳转到用户资料</button>
  </view>
</template>

<script setup>
import './index.less'
import Counter from '../../components/Counter.vue'
import Taro from '@tarojs/taro'

const goToUserProfile = () => {
  Taro.navigateTo({
    url: '/pages/user-profile/index'
  })
}
</script>

<style scoped>
.nav-btn {
  margin: 20px;
  padding: 10px 20px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>
