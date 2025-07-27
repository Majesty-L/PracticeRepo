<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <!-- 添加跳转按钮 -->
    <button @tap="goToUserProfile" class="nav-btn">跳转到用户资料</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Hello')

const goToUserProfile = () => {
  uni.navigateTo({
    url: '/pages/user-profile/user-profile'
  })
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.nav-btn {
  margin: 40rpx;
  padding: 20rpx 40rpx;
  background: linear-gradient(45deg, #007AFF, #5856D6);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
}

.nav-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}
</style>
