import { Word, LearningProgress, UserSettings, WrongAnswer } from '../types'

// 示例字词数据
const sampleWords: Word[] = [
  // 难度1 - 基础汉字
  { id: '1', character: '人', pinyin: 'rén', meaning: '人类，人员', difficulty: 1, strokes: ['丿', '乀'] },
  { id: '2', character: '大', pinyin: 'dà', meaning: '大的，巨大', difficulty: 1, strokes: ['一', '丿', '乀'] },
  { id: '3', character: '小', pinyin: 'xiǎo', meaning: '小的，微小', difficulty: 1, strokes: ['丨', '八', '丶'] },
  { id: '4', character: '我', pinyin: 'wǒ', meaning: '我，自己', difficulty: 1, strokes: ['手', '戈'] },
  { id: '5', character: '你', pinyin: 'nǐ', meaning: '你，你们', difficulty: 1, strokes: ['亻', '尔'] },
  { id: '6', character: '他', pinyin: 'tā', meaning: '他，他们', difficulty: 1, strokes: ['亻', '也'] },
  { id: '7', character: '她', pinyin: 'tā', meaning: '她，她们', difficulty: 1, strokes: ['女', '也'] },
  { id: '8', character: '爱', pinyin: 'ài', meaning: '爱，喜欢', difficulty: 1, strokes: ['爫', '冖', '友'] },
  { id: '9', character: '学', pinyin: 'xué', meaning: '学习，学校', difficulty: 1, strokes: ['冖', '子'] },
  { id: '10', character: '书', pinyin: 'shū', meaning: '书，书籍', difficulty: 1, strokes: ['聿', '曰'] },
  { id: '11', character: '水', pinyin: 'shuǐ', meaning: '水，液体', difficulty: 1, strokes: ['丨', '乀', '丿', '乀'] },
  { id: '12', character: '火', pinyin: 'huǒ', meaning: '火，火焰', difficulty: 1, strokes: ['丿', '丿', '丿', '丿'] },
  { id: '13', character: '山', pinyin: 'shān', meaning: '山，山峰', difficulty: 1, strokes: ['山'] },
  { id: '14', character: '日', pinyin: 'rì', meaning: '日，太阳', difficulty: 1, strokes: ['日'] },
  { id: '15', character: '月', pinyin: 'yuè', meaning: '月，月亮', difficulty: 1, strokes: ['月'] },
  { id: '16', character: '天', pinyin: 'tiān', meaning: '天，天空', difficulty: 1, strokes: ['一', '大'] },
  { id: '17', character: '地', pinyin: 'dì', meaning: '地，土地', difficulty: 1, strokes: ['土', '也'] },
  { id: '18', character: '中', pinyin: 'zhōng', meaning: '中，中间', difficulty: 1, strokes: ['丨', '口'] },
  { id: '19', character: '文', pinyin: 'wén', meaning: '文，文字', difficulty: 1, strokes: ['亠', '乂'] },
  { id: '20', character: '字', pinyin: 'zì', meaning: '字，汉字', difficulty: 1, strokes: ['宀', '子'] },

  // 难度2 - 常用词语
  { id: '21', character: '苹果', pinyin: 'píng guǒ', meaning: '苹果，水果', difficulty: 2, strokes: [] },
  { id: '22', character: '香蕉', pinyin: 'xiāng jiāo', meaning: '香蕉，水果', difficulty: 2, strokes: [] },
  { id: '23', character: '西瓜', pinyin: 'xī guā', meaning: '西瓜，水果', difficulty: 2, strokes: [] },
  { id: '24', character: '电脑', pinyin: 'diàn nǎo', meaning: '电脑，计算机', difficulty: 2, strokes: [] },
  { id: '25', character: '手机', pinyin: 'shǒu jī', meaning: '手机，电话', difficulty: 2, strokes: [] },
  { id: '26', character: '学校', pinyin: 'xué xiào', meaning: '学校，教育机构', difficulty: 2, strokes: [] },
  { id: '27', character: '老师', pinyin: 'lǎo shī', meaning: '老师，教师', difficulty: 2, strokes: [] },
  { id: '28', character: '同学', pinyin: 'tóng xué', meaning: '同学，同窗', difficulty: 2, strokes: [] },
  { id: '29', character: '朋友', pinyin: 'péng yǒu', meaning: '朋友，好友', difficulty: 2, strokes: [] },
  { id: '30', character: '家人', pinyin: 'jiā rén', meaning: '家人，家庭成员', difficulty: 2, strokes: [] },
  { id: '31', character: '早上', pinyin: 'zǎo shang', meaning: '早上，早晨', difficulty: 2, strokes: [] },
  { id: '32', character: '中午', pinyin: 'zhōng wǔ', meaning: '中午，正午', difficulty: 2, strokes: [] },
  { id: '33', character: '晚上', pinyin: 'wǎn shang', meaning: '晚上，夜晚', difficulty: 2, strokes: [] },
  { id: '34', character: '今天', pinyin: 'jīn tiān', meaning: '今天，今日', difficulty: 2, strokes: [] },
  { id: '35', character: '明天', pinyin: 'míng tiān', meaning: '明天，明日', difficulty: 2, strokes: [] },
  { id: '36', character: '北京', pinyin: 'běi jīng', meaning: '北京，首都', difficulty: 2, strokes: [] },
  { id: '37', character: '上海', pinyin: 'shàng hǎi', meaning: '上海，城市', difficulty: 2, strokes: [] },
  { id: '38', character: '中国', pinyin: 'zhōng guó', meaning: '中国，国家', difficulty: 2, strokes: [] },
  { id: '39', character: '天气', pinyin: 'tiān qì', meaning: '天气，气候', difficulty: 2, strokes: [] },
  { id: '40', character: '太阳', pinyin: 'tài yáng', meaning: '太阳，恒星', difficulty: 2, strokes: [] },

  // 难度3 - 短句
  { id: '41', character: '我爱学习', pinyin: 'wǒ ài xué xí', meaning: '我爱学习', difficulty: 3, strokes: [] },
  { id: '42', character: '今天天气好', pinyin: 'jīn tiān tiān qì hǎo', meaning: '今天天气好', difficulty: 3, strokes: [] },
  { id: '43', character: '我们去学校', pinyin: 'wǒ men qù xué xiào', meaning: '我们去学校', difficulty: 3, strokes: [] },
  { id: '44', character: '他喜欢画画', pinyin: 'tā xǐ huān huà huà', meaning: '他喜欢画画', difficulty: 3, strokes: [] },
  { id: '45', character: '她在看书', pinyin: 'tā zài kàn shū', meaning: '她在看书', difficulty: 3, strokes: [] },
  { id: '46', character: '请多喝水', pinyin: 'qǐng duō hē shuǐ', meaning: '请多喝水', difficulty: 3, strokes: [] },
  { id: '47', character: '太阳出来了', pinyin: 'tài yáng chū lái le', meaning: '太阳出来了', difficulty: 3, strokes: [] },
  { id: '48', character: '我要早睡', pinyin: 'wǒ yào zǎo shuì', meaning: '我要早睡', difficulty: 3, strokes: [] },
  { id: '49', character: '一起去公园', pinyin: 'yī qǐ qù gōng yuán', meaning: '一起去公园', difficulty: 3, strokes: [] },
  { id: '50', character: '小猫在睡觉', pinyin: 'xiǎo māo zài shuì jiào', meaning: '小猫在睡觉', difficulty: 3, strokes: [] },
  { id: '51', character: '这是我的书', pinyin: 'zhè shì wǒ de shū', meaning: '这是我的书', difficulty: 3, strokes: [] },
  { id: '52', character: '别忘了作业', pinyin: 'bié wàng le zuò yè', meaning: '别忘了作业', difficulty: 3, strokes: [] },
  { id: '53', character: '大家好呀', pinyin: 'dà jiā hǎo ya', meaning: '大家好呀', difficulty: 3, strokes: [] },
  { id: '54', character: '慢慢走路', pinyin: 'màn màn zǒu lù', meaning: '慢慢走路', difficulty: 3, strokes: [] },
  { id: '55', character: '注意安全', pinyin: 'zhù yì ān quán', meaning: '注意安全', difficulty: 3, strokes: [] },
  { id: '56', character: '多吃水果', pinyin: 'duō chī shuǐ guǒ', meaning: '多吃水果', difficulty: 3, strokes: [] },
  { id: '57', character: '开心每一天', pinyin: 'kāi xīn měi yī tiān', meaning: '开心每一天', difficulty: 3, strokes: [] },
  { id: '58', character: '我们是朋友', pinyin: 'wǒ men shì péng yǒu', meaning: '我们是朋友', difficulty: 3, strokes: [] },
  { id: '59', character: '欢迎回来', pinyin: 'huān yíng huí lái', meaning: '欢迎回来', difficulty: 3, strokes: [] },
  { id: '60', character: '谢谢帮助', pinyin: 'xiè xie bāng zhù', meaning: '谢谢帮助', difficulty: 3, strokes: [] }
]

class DataService {
  private static instance: DataService
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // 字词管理
  async getWordsByDifficulty(difficulty: number): Promise<Word[]> {
    return sampleWords.filter(word => word.difficulty === difficulty)
  }

  async getAllWords(): Promise<Word[]> {
    return sampleWords
  }
  async getAllWordsLen(): Promise<number> {
    return 20
  }

  async getWordById(id: string): Promise<Word | null> {
    return sampleWords.find(word => word.id === id) || null
  }

  async getRandomWord(difficulty?: number): Promise<Word> {
    let words = sampleWords
    if (difficulty) {
      words = words.filter(word => word.difficulty === difficulty)
    }
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
  }

  // 进度管理
  async saveProgress(progress: LearningProgress): Promise<void> {
    try {
      const key = `progress_${progress.userId}_${progress.wordId}`
      await uni.setStorageSync(key, JSON.stringify(progress))
    } catch (error) {
      console.error('保存进度失败:', error)
    }
  }

  async getProgress(userId: string, wordId: string): Promise<LearningProgress | null> {
    try {
      const key = `progress_${userId}_${wordId}`
      const data = uni.getStorageSync(key)
      if (data) {
        const progress = JSON.parse(data)
        progress.lastStudied = new Date(progress.lastStudied)
        return progress
      }
      return null
    } catch (error) {
      console.error('获取进度失败:', error)
      return null
    }
  }

  // 错题本管理
  async addWrongAnswer(wrongAnswer: Omit<WrongAnswer, 'id'>): Promise<void> {
    try {
      const wrongAnswers = await this.getWrongAnswers(wrongAnswer.userId)
      const newWrongAnswer: WrongAnswer = {
        ...wrongAnswer,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      wrongAnswers.push(newWrongAnswer)
      await uni.setStorageSync(`wrongAnswers_${wrongAnswer.userId}`, JSON.stringify(wrongAnswers))
    } catch (error) {
      console.error('添加错题失败:', error)
    }
  }

  async getWrongAnswers(userId: string): Promise<WrongAnswer[]> {
    try {
      const data = uni.getStorageSync(`wrongAnswers_${userId}`)
      if (data) {
        const wrongAnswers = JSON.parse(data)
        return wrongAnswers.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
      return []
    } catch (error) {
      console.error('获取错题本失败:', error)
      return []
    }
  }

  // 更新掌握程度
  async updateMasteryLevel(userId: string, wordId: string, correct: boolean): Promise<void> {
    let progress = await this.getProgress(userId, wordId)
    
    if (!progress) {
      progress = {
        userId,
        wordId,
        correctCount: 0,
        totalAttempts: 0,
        lastStudied: new Date(),
        masteryLevel: 0
      }
    }

    progress.totalAttempts++
    if (correct) {
      progress.correctCount++
    }
    progress.lastStudied = new Date()

    // 计算掌握程度 (0-100)
    const accuracy = progress.correctCount / progress.totalAttempts
    progress.masteryLevel = Math.min(100, Math.floor(accuracy * 100))

    await this.saveProgress(progress)
  }
}

export default DataService 