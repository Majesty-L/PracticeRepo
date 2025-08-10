<template>
  <scroll-view class="scroll-view">
    <!-- todo: 有三个难度可以切换查看，三个难度分别对应字、词、短句，每个难度有20个 -->
    <view class="level">
      <text>难度</text>
      <!-- todo: 有三个难度可以切换 -->
    </view>
    <!-- 难度对应的字词列表 -->
    <view class="item" v-for="item in list" :key="item.id">
      <text>{{ item.txt }}</text>
      <!-- todo: 每个字词展示回答次数，成功失败情况，掌握情况，点击可以前往学习 -->
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 使用静态数据：对应三个难度（1=字，2=词，3=短句），每组20条
interface ExerciseItem {
  layer: number
  id: number
  txt: string
}

const list = ref<ExerciseItem[]>([
  // 难度1：常见汉字（20个）
  { layer: 1, id: 1, txt: '我' },
  { layer: 1, id: 2, txt: '你' },
  { layer: 1, id: 3, txt: '他' },
  { layer: 1, id: 4, txt: '她' },
  { layer: 1, id: 5, txt: '它' },
  { layer: 1, id: 6, txt: '爱' },
  { layer: 1, id: 7, txt: '学' },
  { layer: 1, id: 8, txt: '书' },
  { layer: 1, id: 9, txt: '水' },
  { layer: 1, id: 10, txt: '火' },
  { layer: 1, id: 11, txt: '山' },
  { layer: 1, id: 12, txt: '日' },
  { layer: 1, id: 13, txt: '月' },
  { layer: 1, id: 14, txt: '天' },
  { layer: 1, id: 15, txt: '地' },
  { layer: 1, id: 16, txt: '人' },
  { layer: 1, id: 17, txt: '大' },
  { layer: 1, id: 18, txt: '小' },
  { layer: 1, id: 19, txt: '中' },
  { layer: 1, id: 20, txt: '文' },

  // 难度2：常见词语（20个）
  { layer: 2, id: 21, txt: '苹果' },
  { layer: 2, id: 22, txt: '香蕉' },
  { layer: 2, id: 23, txt: '西瓜' },
  { layer: 2, id: 24, txt: '电脑' },
  { layer: 2, id: 25, txt: '手机' },
  { layer: 2, id: 26, txt: '学校' },
  { layer: 2, id: 27, txt: '老师' },
  { layer: 2, id: 28, txt: '同学' },
  { layer: 2, id: 29, txt: '朋友' },
  { layer: 2, id: 30, txt: '家人' },
  { layer: 2, id: 31, txt: '早上' },
  { layer: 2, id: 32, txt: '中午' },
  { layer: 2, id: 33, txt: '晚上' },
  { layer: 2, id: 34, txt: '今天' },
  { layer: 2, id: 35, txt: '明天' },
  { layer: 2, id: 36, txt: '北京' },
  { layer: 2, id: 37, txt: '上海' },
  { layer: 2, id: 38, txt: '中国' },
  { layer: 2, id: 39, txt: '天气' },
  { layer: 2, id: 40, txt: '太阳' },

  // 难度3：常见短句（20个）
  { layer: 3, id: 41, txt: '我爱学习' },
  { layer: 3, id: 42, txt: '今天天气好' },
  { layer: 3, id: 43, txt: '我们去学校' },
  { layer: 3, id: 44, txt: '他喜欢画画' },
  { layer: 3, id: 45, txt: '她在看书' },
  { layer: 3, id: 46, txt: '请多喝水' },
  { layer: 3, id: 47, txt: '太阳出来了' },
  { layer: 3, id: 48, txt: '我要早睡' },
  { layer: 3, id: 49, txt: '一起去公园' },
  { layer: 3, id: 50, txt: '小猫在睡觉' },
  { layer: 3, id: 51, txt: '这是我的书' },
  { layer: 3, id: 52, txt: '别忘了作业' },
  { layer: 3, id: 53, txt: '大家好呀' },
  { layer: 3, id: 54, txt: '慢慢走路' },
  { layer: 3, id: 55, txt: '注意安全' },
  { layer: 3, id: 56, txt: '多吃水果' },
  { layer: 3, id: 57, txt: '开心每一天' },
  { layer: 3, id: 58, txt: '我们是朋友' },
  { layer: 3, id: 59, txt: '欢迎回来' },
  { layer: 3, id: 60, txt: '谢谢帮助' }
])
</script>