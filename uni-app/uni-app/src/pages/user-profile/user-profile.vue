<template>
  <view class="user-profile">
    <!-- 用户头像区域 -->
    <view class="avatar-section">
      <image 
        class="avatar" 
        :src="userInfo.avatar" 
        mode="aspectFill"
        @tap="previewAvatar"
      />
      <view class="avatar-edit" @tap="changeAvatar">
        <text class="edit-icon">📷</text>
      </view>
    </view>

    <!-- 用户信息区域 -->
    <view class="info-section">
      <view class="name-row">
        <text class="username">{{ userInfo.name }}</text>
        <view class="badge" v-if="userInfo.isVip">
          <text class="badge-text">VIP</text>
        </view>
      </view>
      <text class="bio">{{ userInfo.bio }}</text>
      <view class="stats">
        <view class="stat-item">
          <text class="stat-number">{{ userInfo.followers }}</text>
          <text class="stat-label">关注者</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ userInfo.following }}</text>
          <text class="stat-label">关注中</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ userInfo.posts }}</text>
          <text class="stat-label">动态</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮区域 -->
    <view class="action-section">
      <button class="action-btn primary" @tap="editProfile">
        <text class="btn-text">编辑资料</text>
      </button>
      <button class="action-btn secondary" @tap="shareProfile">
        <text class="btn-text">分享</text>
      </button>
    </view>

    <!-- 设置选项 -->
    <view class="settings-section">
      <view class="setting-item" @tap="goToSettings">
        <text class="setting-label">设置</text>
        <text class="setting-arrow">></text>
      </view>
      <view class="setting-item" @tap="goToPrivacy">
        <text class="setting-label">隐私</text>
        <text class="setting-arrow">></text>
      </view>
      <view class="setting-item" @tap="goToHelp">
        <text class="setting-label">帮助</text>
        <text class="setting-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 用户信息数据
const userInfo = reactive({
  name: '张三',
  bio: '热爱生活，分享美好时光',
  avatar: '/static/default-avatar.png',
  isVip: true,
  followers: 1234,
  following: 567,
  posts: 89
})

// 预览头像
const previewAvatar = () => {
  uni.previewImage({
    urls: [userInfo.avatar],
    current: userInfo.avatar
  })
}

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.avatar = res.tempFilePaths[0]
      uni.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

// 编辑资料
const editProfile = () => {
  uni.navigateTo({
    url: '/pages/edit-profile/edit-profile'
  })
}

// 分享资料
const shareProfile = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/settings'
  })
}

// 跳转到隐私页面
const goToPrivacy = () => {
  uni.navigateTo({
    url: '/pages/privacy/privacy'
  })
}

// 跳转到帮助页面
const goToHelp = () => {
  uni.navigateTo({
    url: '/pages/help/help'
  })
}
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(60px);
  width: 36px;
  height: 36px;
  background: #007AFF;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
}

.edit-icon {
  font-size: 16px;
  color: white;
}

.info-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.name-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.badge {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  padding: 4px 8px;
  border-radius: 12px;
}

.badge-text {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.bio {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.action-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.action-btn {
  flex: 1;
  height: 50px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 500;
}

.primary {
  background: linear-gradient(45deg, #007AFF, #5856D6);
  color: white;
}

.secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #007AFF;
  border: 1px solid #007AFF;
}

.btn-text {
  color: inherit;
}

.settings-section {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 16px;
  color: #333;
}

.setting-arrow {
  font-size: 18px;
  color: #999;
}
</style> 