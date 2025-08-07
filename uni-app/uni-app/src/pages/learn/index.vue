<template>
  <view class="content">
    <!-- todo：跳转到有序列表 -->
    <button @tap="goToUserProfile" class="nav-btn">全部</button>
    <div class="container">
      <view class="level">
        <text>难度</text>
        <!-- todo: 有三个难度可以切换 -->

      </view>
      <view class="change">
        <!-- todo: 切换上下一个 -->
      </view>
      <view class="word">
        <!-- todo: 展示一个汉字或词语 -->
      </view>
      <view class="message">
        <!-- todo: 有一个按钮可以弹窗与一个大模型对话，询问与这个字词有关的问题 -->
      </view>
      <view class="choice">
        <!-- todo: 四个选项，分别对应四个发音，选中一个若正确可以切换到下一个字词 -->
         <!-- 若错误记录到错题本上 -->
      </view>
    </div>

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
