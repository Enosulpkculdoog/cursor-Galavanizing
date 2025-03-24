/* eslint-disable */
<template>
  <div class="technical-guide">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>技术指南库</h1>
      <p>专业的镀锌量技术知识库，助力您的工艺优化</p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航 -->
      <div class="guide-sidebar">
        <el-menu
          :default-active="activeSection"
          class="guide-menu"
          @select="handleSectionSelect"
        >
          <el-menu-item index="basic">
            <el-icon><Reading /></el-icon>
            <span>基础概念</span>
          </el-menu-item>
          <el-menu-item index="calculation">
            <el-icon><DataLine /></el-icon>
            <span>计算方法</span>
          </el-menu-item>
          <el-menu-item index="factors">
            <el-icon><DataLine /></el-icon>
            <span>影响因素</span>
          </el-menu-item>
          <el-menu-item index="defects">
            <el-icon><Warning /></el-icon>
            <span>缺陷分析</span>
          </el-menu-item>
          <el-menu-item index="optimization">
            <el-icon><TrendCharts /></el-icon>
            <span>工艺优化</span>
          </el-menu-item>
        </el-menu>
        
        <!-- 书签功能 -->
        <div class="bookmarks-section">
          <div class="bookmarks-header">
            <h3>我的书签</h3>
            <el-button 
              type="primary" 
              size="small" 
              @click="addBookmark(activeSection, sectionTitles[activeSection])"
            >
              <el-icon><Star /></el-icon>
              添加书签
            </el-button>
          </div>
          
          <div class="bookmarks-list" v-if="bookmarks.length > 0">
            <el-scrollbar height="200px">
              <div 
                v-for="bookmark in bookmarks" 
                :key="bookmark.id" 
                class="bookmark-item"
                @click="handleSectionSelect(bookmark.section)"
              >
                <div class="bookmark-content">
                  <div class="bookmark-title">{{ bookmark.title }}</div>
                  <div class="bookmark-desc">{{ bookmark.description }}</div>
                </div>
                <el-button 
                  type="danger" 
                  size="small" 
                  circle
                  @click.stop="removeBookmark(bookmark.id)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </el-scrollbar>
          </div>
          
          <div class="no-bookmarks" v-else>
            <p>暂无书签，添加书签以便快速访问</p>
          </div>
        </div>
        
        <!-- 历史计算记录 -->
        <div class="calc-history-section" v-if="activeSection === 'calculation' && calculationHistory.length > 0">
          <div class="calc-history-header">
            <h3>计算历史</h3>
          </div>
          
          <div class="calc-history-list">
            <el-scrollbar height="200px">
              <div 
                v-for="calc in calculationHistory" 
                :key="calc.id" 
                class="calc-history-item"
              >
                <div class="calc-history-content">
                  <div class="calc-history-title">
                    φ{{ calc.diameter }}mm x {{ calc.thickness }}μm
                  </div>
                  <div class="calc-history-result">
                    {{ calc.weight.toFixed(2) }} g/m²
                  </div>
                  <div class="calc-history-time">
                    {{ new Date(calc.timestamp).toLocaleString() }}
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="guide-content">
        <!-- 基础概念部分 -->
        <div v-show="activeSection === 'basic'" class="guide-section">
          <h2>镀锌量基础概念</h2>
          
          <div class="concept-card">
            <h3>电镀锌 vs 热镀锌</h3>
            <div class="comparison-table">
              <el-table :data="coatingComparison" stripe style="width: 100%">
                <el-table-column prop="aspect" label="对比项目" />
                <el-table-column prop="electro" label="电镀锌" />
                <el-table-column prop="hot" label="热镀锌" />
              </el-table>
            </div>
          </div>
          
          <div class="concept-card">
            <h3>镀锌量定义</h3>
            <div class="definition-content">
              <p>镀锌量是指单位面积上的锌层重量，通常以g/m²表示。计算公式：</p>
              <div class="formula-box">
                <p>锌层重量 = 7.14 × 厚度(μm) × 表面积因子</p>
              </div>
              <div class="formula-explanation">
                <p>其中：</p>
                <ul>
                  <li>7.14 为锌的密度(g/cm³)</li>
                  <li>厚度单位为微米(μm)</li>
                  <li>表面积因子根据钢丝直径计算</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 计算方法部分 -->
        <div v-show="activeSection === 'calculation'" class="guide-section">
          <h2>镀锌量计算方法</h2>
          
          <div class="calculation-methods-section">
            <h2>镀锌量计算方法</h2>
            <p class="section-intro">
              钢丝镀锌量是衡量镀锌质量的重要指标，准确计算镀锌量对于质量控制至关重要。
              以下介绍几种常用的镀锌量计算方法，包括各自的适用场景、优缺点及操作步骤。
            </p>

            <div class="methods-tabs">
              <div class="tab-headers">
                <div 
                  v-for="(method, index) in calculationMethods" 
                  :key="index"
                  class="tab-header"
                  :class="{ 'active': activeMethodTab === index }"
                  @click="activeMethodTab = index"
                >
                  {{ method.name }}
                </div>
              </div>
              
              <div class="tab-content">
                <div class="method-detail">
                  <div class="method-image">
                    <div class="image-placeholder">
                      <span>{{ calculationMethods[activeMethodTab].name }}示意图</span>
                    </div>
                  </div>
                  
                  <div class="method-info">
                    <h3>{{ calculationMethods[activeMethodTab].name }}</h3>
                    
                    <div class="method-desc">
                      <p>{{ calculationMethods[activeMethodTab].description }}</p>
                    </div>
                    
                    <div class="method-steps">
                      <h4>操作步骤</h4>
                      <ol>
                        <li v-for="(step, i) in calculationMethods[activeMethodTab].steps" :key="i">
                          {{ step }}
                        </li>
                      </ol>
                    </div>
                    
                    <div class="method-meta">
                      <div class="meta-item">
                        <strong>精确度：</strong> {{ calculationMethods[activeMethodTab].accuracy }}
                      </div>
                      <div class="meta-item">
                        <strong>适用场景：</strong> {{ calculationMethods[activeMethodTab].suitability }}
                      </div>
                      <div class="meta-item">
                        <strong>注意事项：</strong> {{ calculationMethods[activeMethodTab].notes }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="calculation-comparison">
              <h3>计算方法对比</h3>
              <table>
                <thead>
                  <tr>
                    <th>计算方法</th>
                    <th>精确度</th>
                    <th>复杂度</th>
                    <th>适用场景</th>
                    <th>计算效率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(method, index) in calculationMethods" :key="index">
                    <td>{{ method.name }}</td>
                    <td>{{ method.accuracyRating }}</td>
                    <td>{{ method.complexity }}</td>
                    <td>{{ method.suitableFor }}</td>
                    <td>{{ method.efficiency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="calculation-tool">
              <h3>在线镀锌量计算工具</h3>
              <p>输入以下参数，计算镀锌量：</p>
              
              <div class="calculator-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>钢丝直径 (mm)</label>
                    <input v-model.number="calculator.diameter" type="number" step="0.1" min="0.1" />
                  </div>
                  <div class="form-group">
                    <label>钢丝长度 (m)</label>
                    <input v-model.number="calculator.length" type="number" step="0.1" min="0.1" />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>试样重量 (g)</label>
                    <input v-model.number="calculator.sampleWeight" type="number" step="0.01" min="0.01" />
                  </div>
                  <div class="form-group">
                    <label>除锌后重量 (g)</label>
                    <input v-model.number="calculator.deZincWeight" type="number" step="0.01" min="0.01" />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>计算方法</label>
                    <select v-model="calculator.method">
                      <option v-for="(method, index) in calculationMethods" :key="index" :value="index">
                        {{ method.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <button class="calculate-btn" @click="calculateZincAmount">计算</button>
                  </div>
                </div>
              </div>
              
              <div v-if="calculator.result" class="calculator-result">
                <div class="result-card">
                  <h4>计算结果</h4>
                  <div class="result-value">{{ calculator.result.value }} {{ calculator.result.unit }}</div>
                  <p class="result-note">使用{{ calculator.result.method }}计算</p>
                </div>
                <div class="result-formula">
                  <h4>计算公式</h4>
                  <div class="formula">{{ calculator.result.formula }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 影响因素部分 -->
        <div v-show="activeSection === 'factors'" class="guide-section">
          <h2>镀锌量影响因素</h2>
          
          <div class="factors-section">
            <h2>镀锌量影响因素分析</h2>
            <p class="section-intro">
              镀锌量的多少受到多种因素的影响，包括工艺参数(浸锌时间、锌液温度、提升速度等)、
              材料特性(钢丝直径、表面状态等)以及操作环境等。通过控制这些因素，可以达到理想的镀锌量。
              以下是主要影响因素的详细分析：
            </p>

            <div class="factors-grid">
              <div v-for="(factor, index) in influenceFactors" :key="index" class="factor-card">
                <h3>{{ factor.title }}</h3>
                <p>{{ factor.description }}</p>
                <div class="factor-chart">
                  <!-- 这里可以放置对应的图表 -->
                  <div class="chart-placeholder">
                    <div class="bar-chart">
                      <div 
                        v-for="(value, i) in factor.chartData.values" 
                        :key="i"
                        class="chart-bar"
                        :style="{height: (value / 200 * 100) + '%'}"
                      >
                        <span class="bar-value">{{value}}</span>
                      </div>
                    </div>
                    <div class="chart-labels">
                      <span 
                        v-for="(label, i) in factor.chartData.labels" 
                        :key="i"
                        class="chart-label"
                      >{{label}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="simulation-panel">
              <h3>交互模拟：影响因素组合效果</h3>
              <p>调整下方参数，观察不同参数组合对镀锌量和质量的影响：</p>
              
              <div class="simulation-controls">
                <div v-for="(param, index) in simulationParams" :key="index" class="param-control">
                  <label>{{ param.name }} ({{ param.unit }})</label>
                  <div class="slider-container">
                    <input 
                      type="range" 
                      v-model.number="param.value" 
                      :min="param.min" 
                      :max="param.max" 
                      :step="param.step"
                      @input="updateSimulation"
                    >
                    <span class="param-value">{{ param.value }}</span>
                  </div>
                </div>
              </div>
              
              <div class="simulation-results">
                <div class="result-box">
                  <h4>预计镀锌量</h4>
                  <div class="result-value">{{ Math.round(simulationResult.weight) }} g/m²</div>
                </div>
                <div class="result-box">
                  <h4>质量评级</h4>
                  <div class="quality-stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= simulationResult.quality }">★</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="factors-table">
              <h3>影响因素对比表</h3>
              <table>
                <thead>
                  <tr>
                    <th>影响因素</th>
                    <th>影响程度</th>
                    <th>控制难度</th>
                    <th>推荐设置</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in factorsTable" :key="index">
                    <td>{{ item.factor }}</td>
                    <td>{{ item.significance }}</td>
                    <td>{{ item.control }}</td>
                    <td>{{ item.recommendation }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- 缺陷分析部分 -->
        <div v-show="activeSection === 'defects'" class="guide-section">
          <h2>镀锌缺陷分析</h2>
          
          <div class="defects-grid">
            <div v-for="(defect, index) in coatingDefects" 
                 :key="index" 
                 class="defect-card"
            >
              <div class="defect-image">
                <el-image 
                  :src="defect.image" 
                  :preview-src-list="[defect.image]"
                  fit="cover"
                />
              </div>
              <div class="defect-content">
                <h3>{{ defect.name }}</h3>
                <p class="defect-description">{{ defect.description }}</p>
                
                <div class="defect-details">
                  <div class="defect-causes">
                    <h4>可能原因</h4>
                    <ul>
                      <li v-for="(cause, causeIndex) in defect.causes" 
                            :key="causeIndex">{{ cause }}</li>
                    </ul>
                  </div>
                  
                  <div class="defect-solutions">
                    <h4>解决方案</h4>
                    <ul>
                      <li v-for="(solution, solutionIndex) in defect.solutions" 
                            :key="solutionIndex">{{ solution }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="additional-info">
            <h3>缺陷检测方法</h3>
            <el-collapse>
              <el-collapse-item title="目视检查" name="1">
                <div class="method-content">
                  <p>目视检查是最基本的缺陷检测方法，可以快速发现表面明显的锌瘤、漏镀等缺陷。</p>
                  <ul>
                    <li>检查方法：在充足的光线下，检查人员绕钢丝表面360°观察</li>
                    <li>优点：快速、简便、无需设备</li>
                    <li>缺点：依赖检查人员经验，不适用于微小缺陷</li>
                  </ul>
                </div>
              </el-collapse-item>
              
              <el-collapse-item title="显微放大检查" name="2">
                <div class="method-content">
                  <p>使用显微镜或放大镜对钢丝表面进行放大观察，可以发现微小的表面缺陷。</p>
                  <ul>
                    <li>检查方法：使用10-40倍放大镜或显微镜检查</li>
                    <li>优点：可发现肉眼难以察觉的微小缺陷</li>
                    <li>缺点：检查速度较慢，不适合大批量检测</li>
                  </ul>
                </div>
              </el-collapse-item>
              
              <el-collapse-item title="截面金相分析" name="3">
                <div class="method-content">
                  <p>通过对钢丝截面进行金相分析，可以观察锌层内部结构和锌铁合金层厚度。</p>
                  <ul>
                    <li>检查方法：截取样品，制备金相试样，在显微镜下观察</li>
                    <li>优点：可以观察到锌层内部结构和缺陷</li>
                    <li>缺点：破坏性测试，只能抽样检查</li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        
        <!-- 工艺优化部分 -->
        <div v-show="activeSection === 'optimization'" class="guide-section">
          <h2>镀锌工艺优化</h2>
          
          <div class="optimization-content">
            <div class="optimization-card">
              <h3>工艺参数优化</h3>
              <div class="parameter-sliders">
                <div v-for="(param, index) in processParameters" 
                     :key="index" 
                     class="parameter-item"
                >
                  <div class="parameter-header">
                    <span class="parameter-name">{{ param.name }}</span>
                    <span class="parameter-value">{{ param.value }}{{ param.unit }}</span>
                  </div>
                  <el-slider
                    v-model="param.value"
                    :min="param.min"
                    :max="param.max"
                    :step="param.step"
                    @change="updateOptimizationChart"
                  />
                </div>
              </div>
              
              <div class="optimization-chart">
                <canvas ref="optimizationChartRef"></canvas>
              </div>
            </div>
            
            <div class="optimization-card">
              <h3>优化建议</h3>
              <div class="optimization-tips">
                <div v-for="(tip, index) in optimizationTips" :key="index" class="optimization-tip-section">
                  <h4>{{ tip.title }}</h4>
                  <ul>
                    <li v-for="(item, itemIndex) in tip.items" :key="itemIndex">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { 
  Reading, DataLine, Warning, TrendCharts,
  Picture, Star, Delete
} from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import Chart from 'chart.js/auto'
import { ElMessage } from 'element-plus'

// 使用Vuex和路由
const store = useStore()
const route = useRoute()
const router = useRouter()

// 当前激活的计算方法选项卡
const activeMethodTab = ref(0)

// 章节标题映射
const sectionTitles = {
  'basic': '基础概念',
  'calculation': '计算方法',
  'factors': '影响因素',
  'defects': '缺陷分析',
  'optimization': '工艺优化'
}

// 当前激活的章节
const activeSection = ref(store.getters.getLastViewedSection || 'basic')

// 从路由参数初始化章节
onMounted(() => {
  // 从路由参数初始化章节
  if (route.params.section && sectionTitles[route.params.section]) {
    activeSection.value = route.params.section
    store.dispatch('saveLastViewedSection', route.params.section)
  }
  
  // 使用更安全的方法初始化图表，延迟执行以确保DOM完全渲染
  setTimeout(() => {
    try {
      // 只有在optimization部分才初始化图表
      if (activeSection.value === 'optimization') {
        updateOptimizationChart()
      }
      
      // 如果有计算结果历史，显示最新的
      if (calculationHistory.value && calculationHistory.value.length > 0) {
        const lastCalc = calculationHistory.value[0]
        calcForm.diameter = lastCalc.diameter
        calcForm.thickness = lastCalc.thickness
        calcResult.value = {
          weight: lastCalc.weight,
          surfaceFactor: lastCalc.surfaceFactor
        }
      }
    } catch (error) {
      console.warn('初始化图表时出错:', error)
    }
  }, 300)
})

// 监听路由变化
watch(() => route.params.section, (newSection) => {
  if (newSection && sectionTitles[newSection]) {
    activeSection.value = newSection
    store.dispatch('saveLastViewedSection', newSection)
  }
})

// 处理章节选择
const handleSectionSelect = (index) => {
  activeSection.value = index
  // 保存当前浏览章节到Vuex
  store.dispatch('saveLastViewedSection', index)
  // 更新路由
  router.push({ name: 'TechnicalGuideSection', params: { section: index } })
}

// 电镀锌与热镀锌对比数据
const coatingComparison = [
  {
    aspect: '镀层厚度',
    electro: '通常较薄，5-25μm',
    hot: '通常较厚，25-120μm'
  },
  {
    aspect: '镀层结构',
    electro: '纯锌层',
    hot: '锌铁合金层和纯锌层'
  },
  {
    aspect: '附着力',
    electro: '物理附着',
    hot: '冶金结合'
  },
  {
    aspect: '耐腐蚀性',
    electro: '较低',
    hot: '较高'
  },
  {
    aspect: '适用范围',
    electro: '主要用于薄钢丝',
    hot: '广泛用于各种钢丝产品'
  }
]

// 计算器表单数据
const calcForm = reactive({
  diameter: 2.0,
  thickness: 25
})

const calcResult = ref(null)

// eslint-disable-next-line no-unused-vars
const calculateCoating = () => {
  const d = calcForm.diameter
  const t = calcForm.thickness
  
  // 表面积因子 (近似公式)
  const surfaceFactor = Math.PI / (1000 * d)
  
  // 计算镀锌量 (g/m²)
  const weight = 7.14 * t * surfaceFactor * 1000
  
  const result = {
    id: new Date().getTime(),
    diameter: d,
    thickness: t,
    surfaceFactor: surfaceFactor,
    weight: weight,
    timestamp: new Date().getTime()
  }
  
  calcResult.value = result
  
  // 保存计算结果到Vuex
  store.dispatch('saveTechnicalGuideCalculation', result)
  
  ElMessage({
    message: '计算完成',
    type: 'success'
  })
}

// 获取历史计算记录
const calculationHistory = computed(() => {
  return store.getters.getTechnicalGuideCalculations
})

// eslint-disable-next-line no-unused-vars
const measurementSteps = [
  {
    title: '步骤1: 样品准备',
    description: '准备规定长度的镀锌钢丝样品，测量并记录直径。'
  },
  {
    title: '步骤2: 称重',
    description: '使用精密天平称量样品重量(W1)。'
  },
  {
    title: '步骤3: 除锌',
    description: '将样品浸入盐酸溶液(1:1)中，除去锌层，再用蒸馏水冲洗并干燥。'
  },
  {
    title: '步骤4: 再次称重',
    description: '称量除锌后的样品重量(W2)。'
  },
  {
    title: '步骤5: 计算',
    description: '镀锌量 = (W1-W2) / (π×D×L) × 10000，其中D为直径(mm)，L为长度(mm)。'
  }
]

// 影响因素数据
const influenceFactors = [
  {
    title: '钢丝直径',
    icon: Picture,
    description: '钢丝直径影响锌层沉积的均匀性和附着量，直径越小，单位面积镀锌量越高。',
    chartData: {
      labels: ['0.5mm', '1.0mm', '2.0mm', '3.0mm', '4.0mm'],
      values: [180, 160, 140, 130, 120]
    }
  },
  {
    title: '浸锌时间',
    icon: Picture,
    description: '浸锌时间直接影响锌层厚度，但超过临界时间后增长速度会降低。',
    chartData: {
      labels: ['30s', '60s', '90s', '120s', '150s'],
      values: [80, 120, 140, 150, 155]
    }
  },
  {
    title: '锌液温度',
    icon: Picture,
    description: '温度影响锌的流动性和反应速率，通常在445-465℃之间效果最佳。',
    chartData: {
      labels: ['430℃', '440℃', '450℃', '460℃', '470℃'],
      values: [110, 130, 150, 140, 125]
    }
  },
  {
    title: '提升速度',
    icon: Picture,
    description: '从锌液中提升的速度影响锌层厚度的均匀性，速度越慢越均匀。',
    chartData: {
      labels: ['极慢', '慢', '中等', '快', '极快'],
      values: [160, 150, 140, 120, 100]
    }
  }
]

// 模拟参数
const simulationParams = reactive([
  {
    name: '钢丝直径',
    value: 2.0,
    min: 0.5,
    max: 5.0,
    step: 0.1,
    unit: 'mm',
    factor: 1.0
  },
  {
    name: '浸锌时间',
    value: 60,
    min: 30,
    max: 150,
    step: 5,
    unit: 's',
    factor: 0.8
  },
  {
    name: '锌液温度',
    value: 450,
    min: 430,
    max: 470,
    step: 5,
    unit: '℃',
    factor: 0.7
  },
  {
    name: '提升速度',
    value: 3,
    min: 1,
    max: 5,
    step: 1,
    unit: '级',
    factor: 0.5
  }
])

// 模拟结果
const simulationResult = reactive({
  weight: 140,
  quality: 4
})

// 更新模拟结果
const updateSimulation = () => {
  // 基础镀锌量
  let baseWeight = 140
  
  // 根据直径调整
  const diameterFactor = 1 - (simulationParams[0].value - 0.5) / 9
  
  // 根据浸锌时间调整
  const timeFactor = 0.5 + (simulationParams[1].value / 150) * 0.5
  
  // 根据温度调整
  const tempValue = simulationParams[2].value
  const tempFactor = tempValue < 450 ? 
    0.8 + (tempValue - 430) / 20 * 0.2 : 
    1.0 - (tempValue - 450) / 20 * 0.2
  
  // 根据提升速度调整
  const speedValue = simulationParams[3].value
  const speedFactor = 1.0 - (speedValue - 1) / 4 * 0.3
  
  // 计算最终镀锌量
  const weight = baseWeight * diameterFactor * timeFactor * tempFactor * speedFactor
  
  // 更新结果
  simulationResult.weight = weight
  
  // 质量评分 (1-5)
  const qualityScore = Math.min(5, Math.max(1, 
    3 + 
    (tempValue >= 445 && tempValue <= 465 ? 1 : -1) + 
    (speedValue <= 3 ? 1 : -1)
  ))
  
  simulationResult.quality = qualityScore
}

// 影响因素对比表
const factorsTable = [
  {
    factor: '钢丝直径',
    significance: '高',
    control: '低',
    recommendation: '根据产品规格选择合适直径'
  },
  {
    factor: '浸锌时间',
    significance: '高',
    control: '中',
    recommendation: '60-90秒，根据直径调整'
  },
  {
    factor: '锌液温度',
    significance: '高',
    control: '中',
    recommendation: '450-460℃'
  },
  {
    factor: '提升速度',
    significance: '中',
    control: '高',
    recommendation: '缓慢均匀提升'
  },
  {
    factor: '钢丝表面处理',
    significance: '高',
    control: '高',
    recommendation: '彻底清洁和活化处理'
  },
  {
    factor: '锌液成分',
    significance: '中',
    control: '中',
    recommendation: '控制铁、铝含量'
  }
]

// 镀层缺陷数据
const coatingDefects = [
  {
    name: '锌瘤',
    image: 'https://placehold.co/400x300?text=ZincNodule',
    description: '表面出现锌颗粒凸起，通常由锌液温度过高或杂质引起。',
    causes: [
      '镀锌温度过高',
      '镀锌时间过长',
      '钢丝表面粗糙'
    ],
    solutions: [
      '调整镀锌温度',
      '优化镀锌时间',
      '改善钢丝表面质量'
    ]
  },
  {
    name: '漏镀',
    image: 'https://placehold.co/400x300?text=BareSpot',
    description: '镀层局部缺失',
    causes: [
      '表面油污未清除',
      '镀锌槽液污染',
      '电流分布不均'
    ],
    solutions: [
      '加强表面预处理',
      '定期更换镀锌液',
      '优化电极布置'
    ]
  },
  {
    name: '粗糙度异常',
    image: 'https://placehold.co/400x300?text=Roughness',
    description: '镀层表面粗糙度超出正常范围',
    causes: [
      '钢丝本体表面不平整',
      '预处理不充分',
      '镀锌液杂质过多'
    ],
    solutions: [
      '提高钢丝基材质量',
      '加强预处理工艺',
      '定期过滤镀锌液'
    ]
  },
  {
    name: '锌灰附着',
    image: 'https://placehold.co/400x300?text=ZincAsh',
    description: '镀层表面附着锌灰，影响外观质量',
    causes: [
      '镀锌池温度过高',
      '搅拌不充分',
      '出锌冷却速度不当'
    ],
    solutions: [
      '控制镀锌温度',
      '优化搅拌工艺',
      '调整冷却速度'
    ]
  }
]

// 工艺参数
const processParameters = ref(store.getters.getCustomParameters ? 
  [
    {
      name: '镀锌温度',
      value: store.getters.getCustomParameters.temperature || 75,
      min: 60,
      max: 90,
      step: 1,
      unit: '°C'
    },
    {
      name: '镀锌时间',
      value: store.getters.getCustomParameters.time || 60,
      min: 30,
      max: 120,
      step: 5,
      unit: 's'
    },
    {
      name: '电流密度',
      value: store.getters.getCustomParameters.current || 5,
      min: 2,
      max: 8,
      step: 0.5,
      unit: 'A/dm²'
    }
  ] : 
  [
    {
      name: '镀锌温度',
      value: 75,
      min: 60,
      max: 90,
      step: 1,
      unit: '°C'
    },
    {
      name: '镀锌时间',
      value: 60,
      min: 30,
      max: 120,
      step: 5,
      unit: 's'
    },
    {
      name: '电流密度',
      value: 5,
      min: 2,
      max: 8,
      step: 0.5,
      unit: 'A/dm²'
    }
  ]
)

// 优化建议
const optimizationTips = [
  {
    title: '预处理优化',
    items: [
      '酸洗浓度控制在15-18%，温度控制在60-70℃',
      '助镀液浓度保持在200-250g/L，pH值控制在4.5-5.0',
      '预热温度控制在150-180℃，时间不少于1分钟'
    ]
  },
  {
    title: '热镀工艺优化',
    items: [
      '锌液温度稳定控制在450-460℃',
      '浸锌时间根据钢丝直径调整，通常1-3分钟',
      '锌锅内保持循环流动，避免温度不均'
    ]
  },
  {
    title: '冷却优化',
    items: [
      '采用分级冷却，先空冷后水冷',
      '水冷温度控制在30-40℃',
      '冷却速率均匀，避免锌层开裂'
    ]
  },
  {
    title: '检测与控制',
    items: [
      '每班检测不少于3次镀锌量',
      '使用X射线测厚仪进行在线监测',
      '建立镀锌量与工艺参数的关联模型'
    ]
  }
]

// 图表引用
// const factorCharts = ref([]) // 移除未使用的变量
const optimizationChartRef = ref(null)
let optimizationChart = null

// 更新优化图表
const updateOptimizationChart = () => {
  if (!optimizationChartRef.value) return
  
  // 使用requestAnimationFrame来减少更新频率，避免ResizeObserver过载
  if (window._chartUpdateTimeout) {
    cancelAnimationFrame(window._chartUpdateTimeout)
  }
  
  // 避免频繁重绘导致的ResizeObserver错误
  window._chartUpdateTimeout = requestAnimationFrame(() => {
    try {
      if (!optimizationChart) {
        // 设置延迟，确保DOM已完全渲染
        setTimeout(() => {
          try {
            optimizationChart = new Chart(optimizationChartRef.value, {
              type: 'radar',
              data: {
                labels: ['镀层质量', '均匀性', '附着力', '耐腐蚀性'],
                datasets: [{
                  label: '优化效果',
                  data: [80, 75, 85, 80],
                  backgroundColor: 'rgba(43, 93, 128, 0.2)',
                  borderColor: 'rgba(43, 93, 128, 1)',
                  pointBackgroundColor: 'rgba(43, 93, 128, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(43, 93, 128, 1)'
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 0 // 禁用动画以减少重绘
                },
                plugins: {
                  legend: {
                    display: false // 隐藏图例以减少布局计算
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }
            });
          } catch (error) {
            console.warn('Chart初始化错误', error);
          }
        }, 100);
        return;
      }

      const temperature = processParameters.value[0].value;
      const time = processParameters.value[1].value;
      const current = processParameters.value[2].value;
      
      // 模拟计算优化效果
      const quality = Math.min(100, (temperature - 60) * 0.5 + (time - 30) * 0.3 + (current - 2) * 0.2);
      
      // 只有当图表实例存在时才更新数据
      if (optimizationChart) {
        optimizationChart.data.datasets[0].data = [quality, quality * 0.9, quality * 0.85, quality * 0.95];
        optimizationChart.update('none'); // 使用'none'模式来减少动画，提高性能
      }
      
      // 保存自定义参数到Vuex
      store.dispatch('saveCustomParameters', {
        temperature,
        time,
        current
      });
    } catch (error) {
      console.warn('图表更新错误', error);
    }
  });
}

// 添加书签功能
const addBookmark = (section, title) => {
  store.dispatch('saveTechnicalGuideBookmark', {
    section,
    title,
    description: `${new Date().toLocaleDateString()} 书签`
  })
  
  ElMessage({
    message: '已添加书签',
    type: 'success'
  })
}

// 书签列表
const bookmarks = computed(() => {
  return store.getters.getTechnicalGuideBookmarks
})

// 移除书签
const removeBookmark = (bookmarkId) => {
  store.dispatch('removeTechnicalGuideBookmark', bookmarkId)
  
  ElMessage({
    message: '已移除书签',
    type: 'success'
  })
}

// 页面挂载时初始化图表
onMounted(() => {
  // 从路由参数初始化章节
  if (route.params.section && sectionTitles[route.params.section]) {
    activeSection.value = route.params.section
    store.dispatch('saveLastViewedSection', route.params.section)
  }
  
  // 使用更安全的方法初始化图表，延迟执行以确保DOM完全渲染
  setTimeout(() => {
    try {
      // 只有在optimization部分才初始化图表
      if (activeSection.value === 'optimization') {
        updateOptimizationChart()
      }
      
      // 如果有计算结果历史，显示最新的
      if (calculationHistory.value && calculationHistory.value.length > 0) {
        const lastCalc = calculationHistory.value[0]
        calcForm.diameter = lastCalc.diameter
        calcForm.thickness = lastCalc.thickness
        calcResult.value = {
          weight: lastCalc.weight,
          surfaceFactor: lastCalc.surfaceFactor
        }
      }
    } catch (error) {
      console.warn('初始化图表时出错:', error)
    }
  }, 300)
})

// 当activeSection变化时，重新初始化当前选中部分的图表
watch(activeSection, (newSection, oldSection) => {
  if (newSection !== oldSection) {
    // 如果切换到了工艺优化部分，需要重新初始化图表
    if (newSection === 'optimization') {
      setTimeout(() => {
        try {
          // 销毁旧图表以避免内存泄漏
          if (optimizationChart) {
            optimizationChart.destroy();
            optimizationChart = null;
          }
          updateOptimizationChart();
        } catch (error) {
          console.warn('切换章节初始化图表时出错:', error);
        }
      }, 300);
    }
  }
})

// 新增计算方法相关数据
const calculationMethods = [
  {
    name: '重量法',
    description: '重量法是通过测量钢丝镀锌前后的重量差来计算镀锌量的方法。这是最直接、最常用的计算方法，适用于大多数生产环境。',
    steps: [
      '取一定长度的钢丝试样，测量其直径和长度',
      '清洁试样表面，确保无油污及其他杂质',
      '使用精密天平称量试样的初始重量',
      '使用规定的除锌溶液（通常为盐酸溶液）溶解掉锌层',
      '清洁并干燥除锌后的钢丝',
      '再次称量钢丝的重量',
      '根据公式计算镀锌量：镀锌量 = (初始重量 - 除锌后重量) / 表面积'
    ],
    accuracy: '高，误差通常在±1-2%',
    suitability: '适用于所有类型的镀锌钢丝，是工业标准测量方法',
    notes: '除锌过程需要控制时间，避免对基体钢丝造成腐蚀',
    accuracyRating: '★★★★★',
    complexity: '中',
    suitableFor: '实验室和工业生产',
    efficiency: '中'
  },
  {
    name: '电解法',
    description: '电解法是通过电化学原理，使用电解装置溶解镀锌层并测量电流量来计算镀锌量的方法。',
    steps: [
      '准备电解装置和电解液（通常为硫酸锌溶液）',
      '将钢丝试样作为阳极放入电解液中',
      '设置合适的电压和电流值',
      '记录电解时间和电流积分值',
      '根据法拉第定律计算溶解的锌量',
      '根据试样表面积计算单位面积镀锌量'
    ],
    accuracy: '较高，但受电解条件影响',
    suitability: '适用于需要无损或局部测量的场景',
    notes: '电解条件需精确控制，操作人员需经过培训',
    accuracyRating: '★★★★☆',
    complexity: '高',
    suitableFor: '研究和特殊产品',
    efficiency: '低'
  },
  {
    name: '磁感应法',
    description: '磁感应法是利用磁性传感器测量镀锌层厚度，然后转换为镀锌量的非接触式测量方法。',
    steps: [
      '校准磁感应测厚仪',
      '将测厚仪探头靠近钢丝表面，不需要接触',
      '测量多个点位的镀锌层厚度',
      '计算平均厚度',
      '根据锌的密度，将厚度转换为单位面积重量'
    ],
    accuracy: '中等，适合快速检测',
    suitability: '适用于在线监测和大批量快速检测',
    notes: '钢丝本身的磁性会影响测量结果，需要合适的校准',
    accuracyRating: '★★★★☆',
    complexity: '低',
    suitableFor: '生产线实时监控',
    efficiency: '高'
  },
  {
    name: '显微测量法',
    description: '显微测量法是通过显微镜观察钢丝横截面，直接测量镀锌层厚度，然后计算镀锌量的方法。',
    steps: [
      '取钢丝试样，制备金相试样（切割、镶嵌、研磨、抛光）',
      '使用显微镜观察试样横截面',
      '测量多个点位的镀锌层厚度',
      '计算平均厚度',
      '根据锌的密度，将厚度转换为单位面积重量'
    ],
    accuracy: '非常高，可观察到微观结构',
    suitability: '适用于研究和精确测量',
    notes: '试样制备耗时且需要专业设备和技术',
    accuracyRating: '★★★★★',
    complexity: '高',
    suitableFor: '研发和质量抽检',
    efficiency: '低'
  }
]

const calculationFormulas = [
  'G = (W₁ - W₂) / (π × d × L) × 1000',
  'G = k × I × t / (π × d × L) × 1000',
  'G = T × ρ × 1000',
  'G = T × ρ × 1000'
]

const calculator = ref({
  diameter: 2.0,
  length: 1.0,
  sampleWeight: 25.0,
  deZincWeight: 24.2,
  method: 0,
  result: null
})

// 镀锌量计算函数
const calculateZincAmount = () => {
  // 获取表单数据
  const { diameter, length, sampleWeight, deZincWeight, method } = calculator.value
  
  // 根据不同计算方法计算镀锌量
  let result
  if (method === 0) { // 重量法
    // 表面积计算（钢丝为圆柱体）：π × 直径 × 长度
    const surfaceArea = Math.PI * diameter * length / 1000 // 转换为m²
    
    // 镀锌量 = (初始重量 - 除锌后重量) / 表面积
    result = (sampleWeight - deZincWeight) / surfaceArea
  } else if (method === 1) { // 电解法
    // 简化计算
    const surfaceArea = Math.PI * diameter * length / 1000
    result = (sampleWeight - deZincWeight) * 1.1 / surfaceArea // 假设系数为1.1
  } else if (method === 2) { // 磁感应法
    // 简化计算，假设厚度为差重除以密度转换得到
    const thickness = (sampleWeight - deZincWeight) / (Math.PI * diameter * length) * 150
    // 密度为7.14 g/cm³
    result = thickness * 7.14
  } else { // 显微测量法
    // 简化计算
    const surfaceArea = Math.PI * diameter * length / 1000
    result = (sampleWeight - deZincWeight) / surfaceArea * 0.98 // 假设精度修正系数为0.98
  }
  
  // 保存计算结果
  calculator.value.result = {
    value: result.toFixed(2),
    unit: 'g/m²',
    method: calculationMethods[method].name,
    formula: calculationFormulas[method],
    timestamp: new Date().getTime()
  }
  
  // 显示成功消息
  ElMessage({
    message: '计算完成',
    type: 'success'
  })
}
</script>

<style scoped>
.technical-guide {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

/* 侧边栏样式 */
.guide-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.guide-menu {
  border-right: none;
  background-color: transparent;
}

.guide-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  border-radius: 8px;
}

.guide-menu .el-menu-item.is-active {
  background-color: var(--primary-color);
  color: white;
}

.guide-menu .el-menu-item .el-icon {
  margin-right: 10px;
}

/* 内容区域样式 */
.guide-content {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.guide-section h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 1.8rem;
}

/* 概念卡片样式 */
.concept-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.concept-card h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.comparison-table {
  margin-top: 15px;
}

.definition-content {
  line-height: 1.6;
}

.formula-box {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  text-align: center;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.formula-explanation {
  margin-top: 15px;
}

.formula-explanation ul {
  list-style-type: none;
  padding-left: 20px;
}

.formula-explanation li {
  margin-bottom: 8px;
  position: relative;
}

.formula-explanation li:before {
  content: '•';
  color: var(--accent-color);
  position: absolute;
  left: -15px;
}

/* 计算器样式 */
.interactive-calc {
  max-width: 400px;
  margin: 0 auto;
}

.calc-result {
  margin-top: 20px;
  text-align: center;
}

.result-box {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 10px;
}

.result-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.result-unit {
  font-size: 1.2rem;
  color: #666;
  margin-left: 5px;
}

.result-details {
  margin-top: 15px;
  color: #666;
}

/* 影响因素网格 */
.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.factor-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.factor-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.factor-header .el-icon {
  margin-right: 10px;
}

.factor-card h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.factor-content {
  margin-top: 15px;
}

.factor-chart {
  height: 200px;
  margin-top: 15px;
}

/* 缺陷分析网格 */
.defects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.defect-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.defect-image {
  height: 200px;
  overflow: hidden;
}

.defect-image .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder .el-icon {
  font-size: 40px;
  color: #999;
}

.defect-content {
  padding: 20px;
}

.defect-description {
  color: #666;
  margin: 10px 0;
}

.defect-details {
  margin-top: 15px;
}

.defect-causes,
.defect-solutions {
  margin-top: 15px;
}

.defect-causes h4,
.defect-solutions h4 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.defect-causes ul,
.defect-solutions ul {
  list-style-type: none;
  padding-left: 20px;
}

.defect-causes li,
.defect-solutions li {
  margin-bottom: 8px;
  position: relative;
}

.defect-causes li:before,
.defect-solutions li:before {
  content: '•';
  color: var(--accent-color);
  position: absolute;
  left: -15px;
}

/* 工艺优化样式 */
.optimization-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.optimization-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.parameter-sliders {
  margin-bottom: 30px;
}

.parameter-item {
  margin-bottom: 20px;
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.parameter-name {
  font-weight: 500;
}

.parameter-value {
  color: var(--primary-color);
}

.optimization-chart {
  height: 300px;
}

/* 书签样式 */
.bookmarks-section {
  margin-top: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.bookmarks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.bookmarks-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.bookmarks-list {
  margin-top: 10px;
}

.bookmark-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bookmark-item:hover {
  background: #e6f1f9;
}

.bookmark-content {
  flex: 1;
  overflow: hidden;
}

.bookmark-title {
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 3px;
}

.bookmark-desc {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-bookmarks {
  text-align: center;
  padding: 15px 0;
  color: #999;
  font-size: 0.9rem;
}

/* 计算历史样式 */
.calc-history-section {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.calc-history-header {
  margin-bottom: 15px;
}

.calc-history-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.calc-history-list {
  margin-top: 10px;
}

.calc-history-item {
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
}

.calc-history-title {
  font-weight: 500;
  color: var(--primary-color);
}

.calc-history-result {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--accent-color);
  margin: 5px 0;
}

.calc-history-time {
  font-size: 0.8rem;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .guide-sidebar {
    width: 100%;
  }
  
  .guide-menu {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .guide-menu .el-menu-item {
    flex-shrink: 0;
    margin-right: 10px;
  }
  
  .bookmarks-section,
  .calc-history-section {
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .optimization-content {
    grid-template-columns: 1fr;
  }
  
  .defects-grid {
    grid-template-columns: 1fr;
  }
  
  .factors-grid {
    grid-template-columns: 1fr;
  }
}

/* 优化建议样式 */
.optimization-tips {
  margin-top: 20px;
}

.optimization-tip-section {
  margin-bottom: 25px;
}

.optimization-tip-section h4 {
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.optimization-tip-section ul {
  list-style-type: none;
  padding-left: 20px;
}

.optimization-tip-section li {
  margin-bottom: 10px;
  position: relative;
  line-height: 1.5;
}

.optimization-tip-section li:before {
  content: '•';
  color: var(--accent-color);
  position: absolute;
  left: -15px;
}

.additional-info {
  margin-top: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.additional-info h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.method-content {
  padding: 15px;
}

.method-content p {
  margin-bottom: 10px;
}

.method-content ul {
  list-style-type: none;
  padding-left: 20px;
}

.method-content li {
  margin-bottom: 8px;
  position: relative;
}

.method-content li:before {
  content: '•';
  color: var(--accent-color);
  position: absolute;
  left: -15px;
}

.factors-section {
  padding: 20px;
}

.section-intro {
  margin-bottom: 30px;
  line-height: 1.6;
  color: #333;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.factor-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  transition: transform 0.3s, box-shadow 0.3s;
}

.factor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.factor-chart {
  margin-top: 15px;
  height: 200px;
}

.chart-placeholder {
  height: 100%;
  position: relative;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80%;
  padding-bottom: 5px;
}

.chart-bar {
  width: 18%;
  background-color: #4a77d4;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s;
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  height: 20%;
}

.chart-label {
  font-size: 12px;
  text-align: center;
  width: 20%;
}

.simulation-panel {
  background-color: #f0f7ff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.simulation-controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.param-control label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.slider-container {
  display: flex;
  align-items: center;
}

.slider-container input {
  flex: 1;
  margin-right: 10px;
}

.param-value {
  min-width: 40px;
  text-align: right;
  font-weight: bold;
}

.simulation-results {
  display: flex;
  gap: 20px;
  margin-top: 25px;
}

.result-box {
  flex: 1;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.result-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c5282;
  margin-top: 10px;
}

.quality-stars {
  font-size: 28px;
  color: #d1d1d1;
  margin-top: 10px;
}

.star.filled {
  color: #f8d346;
}

.factors-table {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.factors-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.factors-table th, .factors-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.factors-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.factors-table tr:last-child td {
  border-bottom: none;
}

.factors-table tr:hover td {
  background-color: #f9f9f9;
}

.calculation-methods-section {
  padding: 20px;
}

.methods-tabs {
  margin: 30px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.tab-headers {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.tab-header {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-header:hover {
  background-color: #e9e9e9;
}

.tab-header.active {
  background-color: #4a77d4;
  color: white;
  font-weight: 500;
}

.tab-content {
  padding: 20px;
}

.method-detail {
  display: flex;
  gap: 30px;
}

.method-image {
  flex: 0 0 250px;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 8px;
}

.method-info {
  flex: 1;
}

.method-desc {
  margin: 15px 0;
  line-height: 1.6;
}

.method-steps ol {
  padding-left: 20px;
  margin: 15px 0;
}

.method-steps li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.method-meta {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.meta-item {
  margin-bottom: 10px;
}

.calculation-comparison {
  margin: 40px 0;
}

.calculation-comparison table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.calculation-comparison th, .calculation-comparison td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.calculation-comparison th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.calculation-tool {
  background-color: #f0f7ff;
  border-radius: 10px;
  padding: 25px;
  margin: 40px 0;
}

.calculator-form {
  margin: 20px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.calculate-btn {
  background-color: #4a77d4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 24px;
  width: 100%;
}

.calculate-btn:hover {
  background-color: #3a67c4;
}

.calculator-result {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.result-card, .result-formula {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.result-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c5282;
  margin: 15px 0;
}

.result-note {
  color: #666;
  font-style: italic;
}

.formula {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  font-family: monospace;
  margin-top: 15px;
  text-align: center;
}
</style> 