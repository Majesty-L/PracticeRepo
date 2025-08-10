// 字词数据接口
export interface Word {
  id: string
  character: string
  pinyin: string
  meaning: string
  difficulty: number
  strokes: string[]
  imageUrl?: string
}

// 学习进度接口
export interface LearningProgress {
  userId: string
  wordId: string
  correctCount: number
  totalAttempts: number
  lastStudied: Date
  masteryLevel: number
}

// 用户设置接口
export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large'
  voiceEnabled: boolean
  difficulty: number
  dailyGoal: number
}

// 课程数据接口
export interface LessonData {
  id: string
  title: string
  words: Word[]
  difficulty: number
  category: string
}

// 错题本接口
export interface WrongAnswer {
  id: string
  wordId: string
  userId: string
  wrongAnswer: string
  correctAnswer: string
  timestamp: Date
  retryCount: number
} 