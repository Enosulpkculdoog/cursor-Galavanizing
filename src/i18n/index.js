import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN'
import enUS from '../locales/en-US'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') || 'zh-CN', // 默认语言
  fallbackLocale: 'en-US', // 备用语言
  messages,
  globalInjection: true, // 全局注入 $t 函数
  silentTranslationWarn: true, // 禁用翻译警告
  silentFallbackWarn: true // 禁用回退警告
})

export default i18n 