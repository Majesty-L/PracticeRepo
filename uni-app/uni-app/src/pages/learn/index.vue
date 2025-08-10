<template>
  <view class="content">
    <!-- 跳转到有序列表页 -->
    <button @tap="goToAllList" class="nav-btn">全部</button>
    <div class="container">
      <view class="level">
        <text>难度</text>
        <!-- 三个难度可以切换 -->
        <view class="difficulty-tabs">
          <text 
            v-for="level in [1, 2, 3]" 
            :key="level"
            :class="['difficulty-tab', { active: currentDifficulty === level }]"
            @tap="changeDifficulty(level)"
          >
            {{ getDifficultyName(level) }}
          </text>
        </view>
      </view>
      
      <view class="change">
        <!-- 切换上下一个 -->
        <button @tap="previousWord" :disabled="currentIndex <= 0" class="nav-arrow">←</button>
        <text class="progress">{{ currentIndex + 1 }} / {{ currentWords.length }}</text>
        <button @tap="nextWord" :disabled="currentIndex >= currentWords.length - 1" class="nav-arrow">→</button>
      </view>
      
      <view class="word">
        <!-- 展示一个汉字或词语 -->
        <text class="character">{{ currentWord?.character }}</text>
        <text class="pinyin">{{ currentWord?.pinyin }}</text>
        <text class="meaning">{{ currentWord?.meaning }}</text>
      </view>
      
      <view class="message">
        <!-- 有一个按钮可以弹窗与一个大模型对话，询问与这个字词有关的问题 -->
        <button @tap="showAIChat" class="ai-btn">AI助手</button>
      </view>
      
      <view class="choice">
        <!-- 四个选项，分别对应四个拼音，点击播放发音 -->
        <button 
          v-for="option in currentOptions" 
          :key="option.id"
          :class="['choice-btn', { 
            selected: selectedAnswer === option.id,
            correct: showResult && option.isCorrect,
            wrong: showResult && !option.isCorrect && selectedAnswer === option.id
          }]"
          @tap="playPinyin(option.id, option.pinyin, option.character)"
        >
          <text class="pinyin-text">{{ option.pinyin }}</text>
          <text class="play-icon">🔊</text>
        </button>
      </view>
      
      <!-- 确认按钮 -->
      <view class="confirm-section" v-if="selectedAnswer !== null">
        <button 
          class="confirm-btn"
          @tap="confirmAnswer"
          :disabled="showResult"
        >
          确认答案
        </button>
      </view>
      
      <!-- 结果反馈 -->
      <view v-if="showResult" class="result">
        <text :class="['result-text', { correct: isCorrect, wrong: !isCorrect }]">
          {{ isCorrect ? '回答正确！' : '回答错误，正确答案是：' + currentWord?.character }}
        </text>
        <button v-if="isCorrect" @tap="nextWord" class="next-btn">下一个</button>
        <button v-else @tap="retryWord" class="retry-btn">重试</button>
      </view>
    </div>

    <!-- AI对话弹窗 -->
    <view v-if="showAIModal" class="ai-modal">
      <view class="ai-modal-content">
        <view class="ai-modal-header">
          <text class="ai-modal-title">AI助手</text>
          <button @tap="closeAIChat" class="close-btn">×</button>
        </view>
        <view class="ai-chat-area">
          <view v-for="message in aiMessages" :key="message.id" class="ai-message">
            <text :class="['message-text', message.type]">{{ message.text }}</text>
          </view>
        </view>
        <view class="ai-input-area">
          <input v-model="aiInput" placeholder="输入你的问题..." class="ai-input" />
          <button @tap="sendAIMessage" class="send-btn">发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataService from '../../services/DataService'
import AudioService from '../../services/AudioService'
import { Word } from '../../types'

const dataService = DataService.getInstance()
const audioService = AudioService.getInstance()

// 响应式数据
const currentDifficulty = ref(1)
const currentWords = ref<Word[]>([])
const currentIndex = ref(0)
const currentOptions = ref<{ id: string; pinyin: string; character: string; isCorrect: boolean }[]>([])
const selectedAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const showAIModal = ref(false)
const aiMessages = ref<{ id: string; text: string; type: 'user' | 'ai' }[]>([])
const aiInput = ref('')

// 计算属性
const currentWord = computed(() => currentWords.value[currentIndex.value])

// 获取难度名称
const getDifficultyName = (level: number) => {
  const names = { 1: '字', 2: '词', 3: '句' }
  return names[level as keyof typeof names] || '未知'
}

// 跳转到全部列表
const goToAllList = () => {
  uni.navigateTo({
    url: '/pages/exercise/allList'
  })
}

// 切换难度
const changeDifficulty = async (difficulty: number) => {
  currentDifficulty.value = difficulty
  currentIndex.value = 0
  await loadWords()
  generateOptions()
}

// 加载字词
const loadWords = async () => {
  try {
    currentWords.value = await dataService.getWordsByDifficulty(currentDifficulty.value)
  } catch (error) {
    console.error('加载字词失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  }
}

// 生成选项
const generateOptions = () => {
  if (!currentWord.value) return
  
  const correctAnswer = currentWord.value.pinyin
  const allWords = currentWords.value
  const otherWords = allWords.filter(word => word.id !== currentWord.value?.id)
  
  // 随机选择3个错误选项
  const wrongOptions = otherWords
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(word => ({
      id: word.id,
      pinyin: word.pinyin,
      character: word.character,
      isCorrect: false
    }))
  
  // 添加正确答案
  const correctOption = {
    id: currentWord.value.id,
    pinyin: correctAnswer,
    character: currentWord.value.character,
    isCorrect: true
  }
  
  // 随机排序选项
  currentOptions.value = [...wrongOptions, correctOption]
    .sort(() => Math.random() - 0.5)
}

// 播放拼音
const playPinyin = async (id: string, pinyin: string, character: string) => {
  selectAnswer(id);
  try {
    await audioService.playPinyin(character)
  } catch (error) {
    console.error('播放拼音失败:', error)
    uni.showToast({
      title: `播放失败: ${pinyin}`,
      icon: 'error',
      duration: 1000
    })
  }
}

// 选择答案
const selectAnswer = (optionId: string) => {
  selectedAnswer.value = optionId
}

// 确认答案
const confirmAnswer = async () => {
  if (selectedAnswer.value === '') return
  
  const selectedOption = currentOptions.value.find(option => option.id === selectedAnswer.value)
  isCorrect.value = selectedOption?.isCorrect || false
  showResult.value = true
  
  // 记录学习进度
  const userId = 'default-user' // 实际项目中应该从用户系统获取
  await dataService.updateMasteryLevel(userId, currentWord.value!.id, isCorrect.value)
  
  // 如果答错了，记录到错题本
  if (!isCorrect.value) {
    await dataService.addWrongAnswer({
      wordId: currentWord.value!.id,
      userId,
      wrongAnswer: selectedOption?.pinyin || '',
      correctAnswer: currentWord.value!.pinyin,
      timestamp: new Date(),
      retryCount: 0
    })
  }
}

// 下一个字词
const nextWord = () => {
  if (currentIndex.value < currentWords.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = ''
    showResult.value = false
    generateOptions()
  } else {
    uni.showToast({
      title: '已完成所有字词！',
      icon: 'success'
    })
  }
}

// 上一个字词
const previousWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = ''
    showResult.value = false
    generateOptions()
  }
}

// 重试当前字词
const retryWord = () => {
  selectedAnswer.value = ''
  showResult.value = false
  generateOptions()
}

// 显示AI对话
const showAIChat = () => {
  showAIModal.value = true
  // 添加欢迎消息
  if (aiMessages.value.length === 0) {
    aiMessages.value.push({
      id: '1',
      text: `你好！我是AI助手，可以帮你解答关于"${currentWord.value?.character}"的问题。`,
      type: 'ai'
    })
  }
}

// 关闭AI对话
const closeAIChat = () => {
  showAIModal.value = false
}

// 发送AI消息
const sendAIMessage = () => {
  if (!aiInput.value.trim()) return
  
  // 添加用户消息
  aiMessages.value.push({
    id: Date.now().toString(),
    text: aiInput.value,
    type: 'user'
  })
  
  // 模拟AI回复
  setTimeout(() => {
    const aiResponse = generateAIResponse(aiInput.value, currentWord.value!)
    aiMessages.value.push({
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      type: 'ai'
    })
    aiInput.value = ''
  }, 1000)
}

// 生成AI回复（模拟）
const generateAIResponse = (question: string, word: Word): string => {
  const responses = [
    `"${word.character}"的拼音是"${word.pinyin}"，意思是"${word.meaning}"。`,
    `这个字/词在日常生活中很常用，比如：${getExampleUsage(word)}`,
    `学习"${word.character}"时，可以注意它的笔画顺序：${word.strokes.join(' → ')}`,
    `"${word.character}"属于${getDifficultyName(word.difficulty)}级别，是基础词汇。`
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// 获取使用示例
const getExampleUsage = (word: Word): string => {
  const examples: Record<string, string> = {
    '人': '我是一个人，你是人，大家都是人。',
    '大': '这个苹果很大，那个房子很大。',
    '小': '小猫很小，小鸟很小。',
    '苹果': '我喜欢吃苹果，苹果很甜。',
    '学校': '我去学校学习，学校有很多老师。',
    '我爱学习': '我爱学习，学习让我快乐。'
  }
  
  return examples[word.character] || '这个字/词在生活中有很多用途。'
}

// 组件挂载时初始化
onMounted(async () => {
  await loadWords()
  generateOptions()
})
</script>

<style scoped>
.content {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
  font-size: 32rpx;
}

.container {
  background-color: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.level {
  margin-bottom: 40rpx;
}

.level text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.difficulty-tabs {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.difficulty-tab {
  padding: 20rpx 40rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s;
}

.difficulty-tab.active {
  background-color: #667eea;
  color: white;
}

.change {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.nav-arrow {
  background-color: #667eea;
  color: white;
  border: none;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  font-size: 32rpx;
}

.nav-arrow:disabled {
  background-color: #ccc;
}

.progress {
  font-size: 28rpx;
  color: #666;
}

.word {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 40rpx;
  background-color: #f8f9fa;
  border-radius: 15rpx;
}

.character {
  font-size: 120rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.pinyin {
  font-size: 32rpx;
  color: #667eea;
  display: block;
  margin-bottom: 10rpx;
}

.meaning {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.message {
  margin-bottom: 40rpx;
  text-align: center;
}

.ai-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.choice {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.choice-btn {
  background-color: #f8f9fa;
  border: 2rpx solid #ddd;
  padding: 30rpx;
  border-radius: 15rpx;
  font-size: 32rpx;
  color: #333;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.choice-btn.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.choice-btn.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.choice-btn.wrong {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.pinyin-text {
  font-size: 36rpx;
  font-weight: 500;
}

.play-icon {
  font-size: 28rpx;
  margin-left: 20rpx;
}

.confirm-section {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}

.confirm-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 25rpx 60rpx;
  border-radius: 25rpx;
  font-size: 32rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.confirm-btn:disabled {
  background-color: #ccc;
  color: #666;
}

.result {
  text-align: center;
  padding: 30rpx;
  background-color: #f8f9fa;
  border-radius: 15rpx;
}

.result-text {
  font-size: 32rpx;
  margin-bottom: 20rpx;
  display: block;
}

.result-text.correct {
  color: #28a745;
}

.result-text.wrong {
  color: #dc3545;
}

.next-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}
.retry-btn {
  background-color: #ea6666;
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

/* AI模态框样式 */
.ai-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ai-modal-content {
  background-color: white;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.ai-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.ai-modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #666;
  padding: 0;
  width: 60rpx;
  height: 60rpx;
}

.ai-chat-area {
  flex: 1;
  padding: 30rpx;
  max-height: 400rpx;
  overflow-y: auto;
}

.ai-message {
  margin-bottom: 20rpx;
}

.message-text {
  display: block;
  padding: 20rpx;
  border-radius: 15rpx;
  font-size: 28rpx;
  max-width: 80%;
}

.message-text.user {
  background-color: #667eea;
  color: white;
  margin-left: auto;
}

.message-text.ai {
  background-color: #f0f0f0;
  color: #333;
}

.ai-input-area {
  display: flex;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  gap: 20rpx;
}

.ai-input {
  flex: 1;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.send-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 20rpx 30rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}
</style>
