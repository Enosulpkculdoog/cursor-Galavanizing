/* eslint-disable */
import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    // 全局状态
    zincCoatingData: {
      averageThickness: 75, // 全球平均镀锌厚度(μm)
      marketPrices: {
        zinc: 2450, // 锌价(美元/吨)
        lastUpdated: '2023-06-01'
      }
    },
    // 用户相关
    userRole: '', // 'engineer', 'quality', 'researcher', 'purchaser', 'consumer'
    userPreferences: {
      preferredStandard: 'ISO', // 默认标准：'ISO', 'ASTM', 'GB'
      measurementUnit: 'metric' // 'metric' 或 'imperial'
    },
    // 应用状态
    calculatorHistory: [], // 用户的计算历史
    savedReports: [],  // 用户保存的检测报告
    // 技术指南数据
    technicalGuideData: {
      lastViewedSection: 'basic',
      bookmarks: [],
      calculationHistory: [],
      customParameters: {
        temperature: 75,
        time: 60,
        current: 5
      }
    },
    user: null,
    locale: localStorage.getItem('locale') || 'zh-CN',
    recentTests: [],
    standards: [
      {
        id: 1,
        code: 'ISO 1461',
        name: '钢铁制品热镀锌层技术要求',
        publishDate: '2009-05-15',
        region: '国际标准',
        category: '热镀锌',
        description: '规定了成品钢铁制品热浸镀锌层的一般特性和试验方法',
        downloadUrl: '#'
      },
      {
        id: 2,
        code: 'ASTM A123',
        name: '钢铁制品热浸镀锌规范',
        publishDate: '2017-03-01',
        region: '美国标准',
        category: '热镀锌',
        description: '适用于各种成品和预制钢材的热浸镀锌层要求',
        downloadUrl: '#'
      },
      {
        id: 3,
        code: 'GB/T 17116',
        name: '金属覆盖层 钢铁制件热浸镀锌层技术要求',
        publishDate: '2018-06-07',
        region: '中国标准',
        category: '热镀锌',
        description: '规定了钢铁制件热浸镀锌层的技术要求和检验方法',
        downloadUrl: '#'
      },
      {
        id: 4,
        code: 'EN 10346',
        name: '连续热镀金属涂层钢板和钢带',
        publishDate: '2015-10-20',
        region: '欧洲标准',
        category: '热镀锌',
        description: '适用于连续热镀金属涂层的低碳钢平板材、宽带材及切边宽板材',
        downloadUrl: '#'
      },
      {
        id: 5,
        code: 'JIS H 8641',
        name: '热镀锌标准',
        publishDate: '2007-01-30',
        region: '日本标准',
        category: '热镀锌',
        description: '规定了钢铁制品热浸镀锌质量和试验方法',
        downloadUrl: '#'
      }
    ],
    currentStandard: null,
    // 技术指南计算历史
    technicalGuideCalculations: [],
    // 技术指南书签
    technicalGuideBookmarks: [],
    // 技术指南最后浏览章节
    lastViewedSection: 'basic',
    // 行业资源数据
    industryResources: {
      // 锌价趋势数据
      zincPriceTrend: {
        labels: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', 
                '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'],
        prices: [2450, 2480, 2520, 2490, 2510, 2540, 2580, 2610, 2590, 2570, 2540, 2520]
      },
      // 年度报告数据
      annualReports: [
        {
          id: 1,
          title: '2023年全球钢丝镀锌量行业分析报告',
          year: 2023,
          coverImage: 'https://placehold.co/300x400?text=Report2023',
          summary: '2023年镀锌钢丝市场分析与技术发展趋势',
          downloadUrl: '#',
          publishDate: '2023-12-15'
        },
        {
          id: 2,
          title: '2022年全球钢丝镀锌量行业分析报告',
          year: 2022,
          coverImage: 'https://placehold.co/300x400?text=Report2022',
          summary: '2022年镀锌钢丝市场分析与技术发展趋势',
          downloadUrl: '#',
          publishDate: '2022-12-20'
        }
      ],
      // 技术论文数据
      technicalPapers: [
        {
          id: 1,
          title: '镀锌钢丝表面质量优化研究',
          authors: '张三, 李四',
          journal: '金属材料与工艺',
          publishDate: '2023-08-15',
          category: 'quality',
          abstract: '本文研究了镀锌过程中影响表面质量的关键因素...',
          downloadUrl: '#',
          citations: 12
        },
        {
          id: 2,
          title: '电解镀锌与热镀锌工艺对比分析',
          authors: '王五, 赵六',
          journal: '材料科学与工程',
          publishDate: '2023-05-22',
          category: 'process',
          abstract: '通过对比电解镀锌与热镀锌两种工艺的特点...',
          downloadUrl: '#',
          citations: 18
        },
        {
          id: 3,
          title: '新型镀锌层厚度在线检测设备的开发',
          authors: '孙七, 周八',
          journal: '检测技术与仪器',
          publishDate: '2023-10-05',
          category: 'testing',
          abstract: '本文介绍了一种基于激光干涉原理的新型镀锌层厚度在线检测设备...',
          downloadUrl: '#',
          citations: 5
        }
      ],
      // 专家问答数据
      expertQuestions: [
        {
          id: 1,
          title: '如何解决镀锌层出现气泡问题？',
          content: '我们生产线最近出现镀锌层表面有气泡的问题，已经调整了锌液温度但效果不明显...',
          asker: {
            name: '张工',
            avatar: 'https://placehold.co/100?text=张工'
          },
          createTime: '2023-11-28',
          answers: 3,
          views: 126,
          status: 'answered'
        },
        {
          id: 2,
          title: '镀锌层厚度不均匀的原因分析',
          content: '我们的产品测试发现镀锌层厚度变化较大，从25μm到45μm不等，请问可能是什么原因导致的？',
          asker: {
            name: '李工',
            avatar: 'https://placehold.co/100?text=李工'
          },
          createTime: '2023-12-05',
          answers: 5,
          views: 98,
          status: 'answered'
        }
      ]
    }
  },
  
  getters: {
    // 获取当前推荐镀锌量(基于用户角色)
    recommendedCoating: (state) => (wireType, diameter) => {
      // 简单示例逻辑
      const baseRecommendation = {
        'standard': 80,   // μm
        'marine': 120,    // μm
        'industrial': 100 // μm
      }
      
      return baseRecommendation[wireType] || 80
    },
    
    // 基于锌层厚度计算理论镀锌量(g/m²)
    theoreticalCoatingWeight: () => (thicknessInMicrons, wireDiameter) => {
      // 锌密度约为7.14 g/cm³
      // 理论公式: 锌层重量(g/m²) = 7.14 × 厚度(μm) × 表面积因子
      const zincDensity = 7.14 // g/cm³
      return thicknessInMicrons * zincDensity
    },
    
    // 获取技术指南最近查看的章节
    getLastViewedSection: (state) => {
      return state.lastViewedSection
    },
    
    // 获取技术指南书签
    getTechnicalGuideBookmarks: (state) => {
      return state.technicalGuideBookmarks
    },
    
    // 获取技术指南计算历史
    getTechnicalGuideCalculations: (state) => {
      return state.technicalGuideCalculations
    },
    
    // 获取自定义工艺参数
    getCustomParameters: (state) => {
      return state.technicalGuideData.customParameters
    },
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    currentLocale: state => state.locale,
    recentTests: state => state.recentTests,
    standards: state => state.standards,
    currentStandard: state => state.currentStandard,
    
    // 获取锌价趋势数据
    zincPriceTrend: state => state.industryResources.zincPriceTrend,
    
    // 获取年度报告数据
    annualReports: state => state.industryResources.annualReports,
    
    // 获取技术论文
    technicalPapers: state => state.industryResources.technicalPapers,
    
    // 获取专家问答
    expertQuestions: state => state.industryResources.expertQuestions
  },
  
  mutations: {
    // 更新锌价格数据
    UPDATE_ZINC_PRICE(state, { price, updateDate }) {
      state.zincCoatingData.marketPrices.zinc = price
      state.zincCoatingData.marketPrices.lastUpdated = updateDate
    },
    
    // 设置用户角色
    SET_USER_ROLE(state, role) {
      state.userRole = role
    },
    
    // 更新用户偏好设置
    UPDATE_USER_PREFERENCES(state, preferences) {
      state.userPreferences = { ...state.userPreferences, ...preferences }
    },
    
    // 添加计算器历史记录
    ADD_CALCULATOR_HISTORY(state, calculationData) {
      state.calculatorHistory.unshift(calculationData)
      // 保持历史记录不超过20条
      if (state.calculatorHistory.length > 20) {
        state.calculatorHistory.pop()
      }
    },
    
    // 保存检测报告
    SAVE_REPORT(state, report) {
      state.savedReports.push(report)
    },
    
    // 更新技术指南最近查看章节
    UPDATE_LAST_VIEWED_SECTION(state, section) {
      state.technicalGuideData.lastViewedSection = section;
    },
    
    // 添加技术指南书签
    ADD_TECHNICAL_GUIDE_BOOKMARK(state, bookmark) {
      state.technicalGuideBookmarks.push(bookmark);
    },
    
    // 删除技术指南书签
    REMOVE_TECHNICAL_GUIDE_BOOKMARK(state, bookmarkId) {
      const index = state.technicalGuideBookmarks.findIndex(b => b.id === bookmarkId);
      if (index !== -1) {
        state.technicalGuideBookmarks.splice(index, 1);
      }
    },
    
    // 添加技术指南计算历史
    ADD_TECHNICAL_GUIDE_CALCULATION(state, calculation) {
      state.technicalGuideCalculations.unshift(calculation);
      // 只保留最近10条记录
      if (state.technicalGuideCalculations.length > 10) {
        state.technicalGuideCalculations.pop();
      }
    },
    
    // 更新自定义工艺参数
    UPDATE_CUSTOM_PARAMETERS(state, parameters) {
      state.technicalGuideData.customParameters = { 
        ...state.technicalGuideData.customParameters, 
        ...parameters 
      }
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOCALE(state, locale) {
      state.locale = locale
      localStorage.setItem('locale', locale)
    },
    SET_RECENT_TESTS(state, tests) {
      state.recentTests = tests
    },
    SET_STANDARDS(state, standards) {
      state.standards = standards
    },
    SET_CURRENT_STANDARD(state, standard) {
      state.currentStandard = standard
    },
    // 保存技术指南最后浏览章节
    SET_LAST_VIEWED_SECTION(state, section) {
      state.lastViewedSection = section;
    },
    
    // 设置锌价趋势数据
    SET_ZINC_PRICE_TREND(state, data) {
      state.industryResources.zincPriceTrend = data
    },
    
    // 设置年度报告数据
    SET_ANNUAL_REPORTS(state, data) {
      state.industryResources.annualReports = data
    },
    
    // 设置技术论文数据
    SET_TECHNICAL_PAPERS(state, data) {
      state.industryResources.technicalPapers = data
    },
    
    // 设置专家问答数据
    SET_EXPERT_QUESTIONS(state, data) {
      state.industryResources.expertQuestions = data
    }
  },
  
  actions: {
    // 异步获取最新锌价
    async fetchLatestZincPrice({ commit }) {
      try {
        // 这里是模拟API请求，实际应用中需替换为真实API调用
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              price: 2580,
              updateDate: new Date().toISOString().split('T')[0]
            })
          }, 800)
        })
        
        commit('UPDATE_ZINC_PRICE', response)
        return response
      } catch (error) {
        console.error('获取锌价失败:', error)
        throw error
      }
    },
    
    // 保存用户角色
    saveUserRole({ commit }, role) {
      commit('SET_USER_ROLE', role)
    },
    
    // 保存用户偏好设置
    saveUserPreferences({ commit }, preferences) {
      commit('UPDATE_USER_PREFERENCES', preferences)
    },
    
    // 添加计算器历史记录
    addCalculatorHistory({ commit }, calculationData) {
      commit('ADD_CALCULATOR_HISTORY', {
        ...calculationData,
        id: new Date().getTime(),
        date: new Date().toISOString()
      })
    },
    
    // 保存检测报告
    saveReport({ commit }, report) {
      commit('SAVE_REPORT', {
        ...report,
        id: new Date().getTime(),
        date: new Date().toISOString()
      })
    },
    
    // 保存技术指南最近查看章节
    saveLastViewedSection({ commit }, section) {
      commit('SET_LAST_VIEWED_SECTION', section)
    },
    
    // 保存技术指南书签
    saveTechnicalGuideBookmark({ commit }, bookmark) {
      commit('ADD_TECHNICAL_GUIDE_BOOKMARK', {
        ...bookmark,
        id: new Date().getTime()
      })
    },
    
    // 删除技术指南书签
    removeTechnicalGuideBookmark({ commit }, bookmarkId) {
      commit('REMOVE_TECHNICAL_GUIDE_BOOKMARK', bookmarkId)
    },
    
    // 保存技术指南计算历史
    saveTechnicalGuideCalculation({ commit }, calculation) {
      commit('ADD_TECHNICAL_GUIDE_CALCULATION', calculation)
    },
    
    // 保存自定义工艺参数
    saveCustomParameters({ commit }, parameters) {
      commit('UPDATE_CUSTOM_PARAMETERS', parameters)
    },
    
    // 登录
    login({ commit }, userData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('SET_USER', {
            id: 1,
            username: userData.username,
            role: 'engineer'
          })
          resolve({ success: true })
        }, 800)
      })
    },
    
    // 登出
    logout({ commit }) {
      commit('SET_USER', null)
    },
    
    // 设置语言
    setLocale({ commit }, locale) {
      commit('SET_LOCALE', locale)
    },
    
    // 获取标准列表
    async fetchStandards({ commit }, params = {}) {
      try {
        // 模拟API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            // 使用store中的模拟数据
            resolve(this.state.standards)
          }, 600)
        })
        
        // 如果请求参数中有limit，则只返回指定数量的标准
        const result = params.limit ? response.slice(0, params.limit) : response
        
        commit('SET_STANDARDS', result)
        return result
      } catch (error) {
        console.error('获取标准列表失败:', error)
        throw error
      }
    },
    
    // 获取标准详情
    async fetchStandardDetail({ commit, state }, id) {
      try {
        // 模拟API请求
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            const standard = state.standards.find(s => s.id === parseInt(id))
            if (standard) {
              resolve(standard)
            } else {
              reject(new Error('未找到标准'))
            }
          }, 600)
        })
        
        commit('SET_CURRENT_STANDARD', response)
        return response
      } catch (error) {
        console.error('获取标准详情失败:', error)
        throw error
      }
    },
    
    // 获取锌价趋势数据
    async fetchZincPriceTrend({ commit, state }) {
      try {
        // 模拟API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(state.industryResources.zincPriceTrend)
          }, 600)
        })
        
        commit('SET_ZINC_PRICE_TREND', response)
        return response
      } catch (error) {
        console.error('获取锌价趋势数据失败:', error)
        throw error
      }
    },
    
    // 获取年度报告数据
    async fetchAnnualReports({ commit, state }) {
      try {
        // 模拟API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(state.industryResources.annualReports)
          }, 600)
        })
        
        commit('SET_ANNUAL_REPORTS', response)
        return response
      } catch (error) {
        console.error('获取年度报告数据失败:', error)
        throw error
      }
    },
    
    // 获取技术论文数据
    async fetchTechnicalPapers({ commit, state }, params = {}) {
      try {
        // 模拟API请求
        const papers = state.industryResources.technicalPapers
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            // 如果有分类参数，按分类筛选
            if (params.category && params.category !== 'all') {
              resolve(papers.filter(p => p.category === params.category))
            } else {
              resolve(papers)
            }
          }, 600)
        })
        
        // 如果有排序参数，按排序处理
        let sortedPapers = [...response]
        if (params.sort) {
          switch (params.sort) {
            case 'latest':
              sortedPapers.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
              break
            case 'cited':
              sortedPapers.sort((a, b) => b.citations - a.citations)
              break
            default:
              break
          }
        }
        
        commit('SET_TECHNICAL_PAPERS', sortedPapers)
        return sortedPapers
      } catch (error) {
        console.error('获取技术论文数据失败:', error)
        throw error
      }
    },
    
    // 获取专家问答数据
    async fetchExpertQuestions({ commit, state }) {
      try {
        // 模拟API请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(state.industryResources.expertQuestions)
          }, 600)
        })
        
        commit('SET_EXPERT_QUESTIONS', response)
        return response
      } catch (error) {
        console.error('获取专家问答数据失败:', error)
        throw error
      }
    }
  },
  
  modules: {
    // 可以在这里添加更复杂的模块化状态
  }
}) 