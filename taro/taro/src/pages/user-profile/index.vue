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
import { reactive } from 'vue'
import Taro from '@tarojs/taro'

// 用户信息数据
const userInfo = reactive({
  name: '张三',
  bio: '热爱生活，分享美好时光',
  avatar: 'https://via.placeholder.com/120x120/667eea/ffffff?text=头像',
  isVip: true,
  followers: 1234,
  following: 567,
  posts: 89
})

// 预览头像
const previewAvatar = () => {
  Taro.previewImage({
    urls: [userInfo.avatar],
    current: userInfo.avatar
  })
}

// 更换头像
const changeAvatar = () => {
  Taro.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.avatar = res.tempFilePaths[0]
      Taro.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

// 编辑资料
const editProfile = () => {
  Taro.navigateTo({
    url: '/pages/edit-profile/index'
  })
}

// 分享资料
const shareProfile = () => {
  Taro.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

// 跳转到设置页面
const goToSettings = () => {
  Taro.navigateTo({
    url: '/pages/settings/index'
  })
}

// 跳转到隐私页面
const goToPrivacy = () => {
  Taro.navigateTo({
    url: '/pages/privacy/index'
  })
}

// 跳转到帮助页面
const goToHelp = () => {
  Taro.navigateTo({
    url: '/pages/help/index'
  })
}
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar:active {
  transform: scale(0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(60px);
  width: 36px;
  height: 36px;
  background: linear-gradient(45deg, #007AFF, #5856D6);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;
}

.avatar-edit:active {
  transform: translateX(60px) scale(0.9);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.6);
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
  animation: slideUp 0.8s ease-out 0.2s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
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
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 12px;
}

.stat-item:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(1.05);
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
  animation: slideUp 0.8s ease-out 0.4s both;
}

.action-btn {
  flex: 1;
  height: 50px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
  animation: slideUp 0.8s ease-out 0.6s both;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.setting-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 122, 255, 0.1), transparent);
  transition: width 0.3s ease;
}

.setting-item:active::before {
  width: 100%;
}

.setting-item:active {
  background: rgba(0, 122, 255, 0.05);
  transform: translateX(5px);
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
  transition: all 0.3s ease;
}

.setting-item:active .setting-arrow {
  color: #007AFF;
  transform: translateX(3px);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .user-profile {
    padding: 15px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }

  .avatar-edit {
    width: 32px;
    height: 32px;
    transform: translateX(50px);
  }

  .info-section {
    padding: 20px;
  }

  .username {
    font-size: 20px;
  }

  .action-btn {
    height: 45px;
    font-size: 14px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .info-section,
  .settings-section {
    background: #1a1a1a;
    color: #fff;
  }

  .username,
  .setting-label {
    color: #fff;
  }

  .bio {
    color: #ccc;
  }

  .stat-number {
    color: #fff;
  }

  .stat-label {
    color: #999;
  }
}
</style>
