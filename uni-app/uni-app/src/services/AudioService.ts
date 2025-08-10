class AudioService {
  private static instance: AudioService
  private audioContext: any = null
  private accessToken: string = ''
  private tokenExpireTime: number = 0
  
  // 百度TTS配置（免费额度：每天5000次）
  private BAIDU_APP_ID = '119737409' // 需要申请百度AI开放平台账号
  private BAIDU_API_KEY = 'StW1z86OCyvzSBtomYSqaEJw'
  private BAIDU_SECRET_KEY = 'cfN2heiKGY73vnY5y2jsRNQ3Kef1c3XR'
  
  // 免费TTS服务（无需注册，无需API密钥）
  private readonly FREE_TTS_URL = 'https://translate.google.com/translate_tts'

  private constructor() {
    // 初始化时获取百度TTS的access token
    this.getBaiduAccessToken()
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  // 获取百度TTS的access token
  private async getBaiduAccessToken() {
    try {
      const response = await uni.request({
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.BAIDU_API_KEY}&client_secret=${this.BAIDU_SECRET_KEY}`,
        method: 'POST'
      })
      
      if (response.statusCode === 200 && response.data && typeof response.data === 'object') {
        const data = response.data as any
        if (data.access_token) {
          this.accessToken = data.access_token
          this.tokenExpireTime = Date.now() + (data.expires_in - 60) * 1000 // 提前1分钟过期
        }
      }
    } catch (error) {
      console.error('获取百度TTS token失败:', error)
    }
  }

  // 播放拼音
  public async playPinyin(character: string): Promise<void> {
    // 清理之前的音频上下文
    if (this.audioContext) {
      this.audioContext.destroy()
    }

    try {
      // 尝试多种播放方案
      await this.tryPlayAudio(character)
    } catch (error) {
      console.error('播放失败，使用降级方案:', error)
      this.fallbackPlay(character)
    }
  }

  // 尝试播放音频
  private async tryPlayAudio(character: string): Promise<void> {
    // #ifdef H5
    // H5环境优先使用Web Speech API（免费且无需网络）
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return this.playWithWebSpeech(character)
    }
    // #endif

    // // #ifdef wx
    // return this.playWithFreeTTS(character);

    // #ifdef APP-PLUS
    // APP环境使用百度TTS
    return this.playWithBaiduTTS(character)
  }

  // H5环境使用Web Speech API（推荐，免费且无需网络）
  private playWithWebSpeech(character: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(character)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.8
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        utterance.onend = () => resolve()
        utterance.onerror = (error) => reject(error)
        
        speechSynthesis.speak(utterance)
      } catch (error) {
        reject(error)
      }
    })
  }

  // 使用百度TTS（需要申请API密钥）
  private async playWithBaiduTTS(character: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查token是否过期
      if (Date.now() > this.tokenExpireTime) {
        this.getBaiduAccessToken()
      }

      if (!this.accessToken) {
        reject(new Error('百度TTS token未获取'))
        return
      }

      // 构建TTS请求URL（兼容性写法）
      const params = {
        tex: character,
        tok: this.accessToken,
        cuid: 'uni-app',
        ctp: '1',
        lan: 'zh',
        spd: '4', // 语速：5-9
        pit: '5', // 音调：5-9
        vol: '5', // 音量：0-15
        per: '0'  // 发音人：0-4
      }

      // 使用uni-app的URL构建方法
      const queryString = Object.keys(params)
        .map(key => `${key}=${params[key as keyof typeof params]}`)
        .join('&')

      const audioUrl = `https://tsn.baidu.com/text2audio?${queryString}`

      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.src = audioUrl
      
      this.audioContext.onPlay(() => {
        console.log('开始播放拼音:', character)
      })
      
      this.audioContext.onEnded(() => {
        console.log('播放完成:', character)
        resolve()
      })
      
      this.audioContext.onError((error: any) => {
        console.error('百度TTS播放失败:', error)
        reject(error)
      })
      
      this.audioContext.play()
    })
  }

  // 使用免费TTS服务（无需注册）
  private async playWithFreeTTS(character: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 使用Google Translate TTS（免费，无需API密钥）
      const audioUrl = `${this.FREE_TTS_URL}?ie=UTF-8&q=${encodeURIComponent(character)}&tl=zh-CN&client=tw-ob`

      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.src = audioUrl
      
      this.audioContext.onPlay(() => {
        console.log('开始播放拼音:', character)
      })
      
      this.audioContext.onEnded(() => {
        console.log('播放完成:', character)
        resolve()
      })
      
      this.audioContext.onError((error: any) => {
        console.error('免费TTS播放失败:', error)
        reject(error)
      })
      
      this.audioContext.play()
    })
  }

  // 降级播放方案
  private fallbackPlay(character: string) {
    uni.showToast({
      title: `播放: ${character}`,
      icon: 'none',
      duration: 1000
    })
  }

  // 停止播放
  public stopPlay() {
    if (this.audioContext) {
      this.audioContext.stop()
      this.audioContext.destroy()
      this.audioContext = null
    }
    
    // #ifdef H5
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    // #endif
  }

  // 设置百度TTS配置（需要在项目中配置）
  public setBaiduConfig(appId: string, apiKey: string, secretKey: string) {
    this.BAIDU_APP_ID = appId
    this.BAIDU_API_KEY = apiKey
    this.BAIDU_SECRET_KEY = secretKey
    this.getBaiduAccessToken()
  }
}

export default AudioService 