/* eslint-disable */
<template>
  <div class="zinc-price">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('resources.zincPrice.title') }}</h1>
        <p>{{ $t('resources.zincPrice.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="container">
      <div class="content-wrapper">
        <!-- 锌价趋势图 -->
        <el-card class="chart-card">
          <div class="card-header">
            <h2>{{ $t('resources.zincPrice.trend') }}</h2>
            <div class="time-range">
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="month">{{ $t('resources.zincPrice.monthly') }}</el-radio-button>
                <el-radio-button label="quarter">{{ $t('resources.zincPrice.quarterly') }}</el-radio-button>
                <el-radio-button label="year">{{ $t('resources.zincPrice.yearly') }}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
        
        <!-- 价格分析 -->
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <h2>{{ $t('resources.zincPrice.analysis') }}</h2>
              <el-tag type="success">{{ $t('resources.zincPrice.latestUpdate') }}: {{ latestUpdate }}</el-tag>
            </div>
          </template>
          <div class="analysis-content">
            <p class="summary">{{ currentAnalysis.summary }}</p>
            
            <h3>{{ $t('resources.zincPrice.keyFactors') }}</h3>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" v-for="(factor, index) in currentAnalysis.factors" :key="index">
                <div class="factor-item">
                  <el-icon class="factor-icon" :class="getFatorIconClass(factor.trend)">
                    <component :is="getFatorIconType(factor.trend)" />
                  </el-icon>
                  <div class="factor-content">
                    <h4>{{ factor.name }}</h4>
                    <p>{{ factor.description }}</p>
                  </div>
                </div>
              </el-col>
            </el-row>
            
            <h3>{{ $t('resources.zincPrice.forecast') }}</h3>
            <p>{{ currentAnalysis.forecast }}</p>
          </div>
        </el-card>
        
        <!-- 价格数据表格 -->
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <h2>{{ $t('resources.zincPrice.historicalData') }}</h2>
              <el-button type="primary" plain>
                <el-icon><Download /></el-icon>
                {{ $t('resources.zincPrice.exportData') }}
              </el-button>
            </div>
          </template>
          <el-table :data="priceData" style="width: 100%" border>
            <el-table-column prop="date" :label="$t('resources.zincPrice.date')" width="180" />
            <el-table-column prop="price" :label="$t('resources.zincPrice.price')" width="150">
              <template #default="scope">
                {{ scope.row.price }} ¥/吨
              </template>
            </el-table-column>
            <el-table-column prop="change" :label="$t('resources.zincPrice.change')">
              <template #default="scope">
                <span :class="scope.row.change > 0 ? 'price-up' : 'price-down'">
                  <el-icon>
                    <component :is="scope.row.change > 0 ? 'CaretTop' : 'CaretBottom'" />
                  </el-icon>
                  {{ Math.abs(scope.row.change).toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="volume" :label="$t('resources.zincPrice.volume')" />
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100"
              :page-size="10"
            />
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts'
import { Download } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const store = useStore()
const chartRef = ref(null)
const timeRange = ref('month')
let chart = null

// 获取锌价数据
const zincPriceTrend = computed(() => store.getters.zincPriceTrend)
const latestUpdate = ref('2023-12-20')

// 锌价分析数据
const analysisData = ref({
  month: {
    summary: '2023年12月锌价整体呈现波动下行态势，均价较上月降低约3.2%，主要受全球经济增长放缓和需求季节性减弱影响。',
    factors: [
      {
        name: '供应端',
        description: '全球锌矿产量小幅回升，冶炼厂产能释放导致精炼锌供应增加。',
        trend: 'up'
      },
      {
        name: '需求端',
        description: '因冬季建筑施工减少，镀锌钢材需求阶段性下降，汽车行业需求相对稳定。',
        trend: 'down'
      },
      {
        name: '库存水平',
        description: 'LME锌库存环比增加12.5%，上海期货交易所锌库存连续三周上升。',
        trend: 'up'
      }
    ],
    forecast: '短期内锌价预计将维持弱势震荡格局，价格区间预计在21000-22500元/吨，临近春节前可能出现小幅反弹。'
  },
  quarter: {
    summary: '2023年第四季度锌价整体呈现先扬后抑走势，季度均价较第三季度下降约1.8%，市场波动明显加剧。',
    factors: [
      {
        name: '宏观经济',
        description: '全球主要经济体增长放缓，制造业PMI指数走弱，对有色金属整体形成压制。',
        trend: 'down'
      },
      {
        name: '产业政策',
        description: '欧美国家基础设施投资计划推进，但执行进度不及预期，对锌消费提振有限。',
        trend: 'neutral'
      },
      {
        name: '成本支撑',
        description: '冶炼加工费维持高位，但能源价格波动对冶炼成本形成一定支撑。',
        trend: 'up'
      }
    ],
    forecast: '展望2024年第一季度，在春节前后预计锌价将小幅回升，随后受制于供需格局，价格中枢或将在22000-23500元/吨区间波动。'
  },
  year: {
    summary: '2023年全年锌价整体呈现宽幅震荡走势，年均价较2022年下降约5.3%，主要受全球经济增速放缓和供应过剩影响。',
    factors: [
      {
        name: '全球供应',
        description: '全年锌矿产量同比增长3.2%，精炼锌产量增长2.8%，供应过剩局面延续。',
        trend: 'up'
      },
      {
        name: '全球需求',
        description: '欧美地区需求疲软，中国需求增长放缓，全球消费量同比增长仅1.5%。',
        trend: 'down'
      },
      {
        name: '库存周期',
        description: '全球锌库存止跌回升，年末较年初增长约15%，市场供需宽松格局明显。',
        trend: 'up'
      }
    ],
    forecast: '展望2024年，在全球经济复苏预期和中国稳增长政策支持下，锌价有望企稳回升，预计全年均价在23000-24500元/吨区间运行，但仍需警惕供应过剩风险。'
  }
})

// 当前分析报告
const currentAnalysis = computed(() => analysisData.value[timeRange.value])

// 历史价格数据
const priceData = ref([
  { date: '2023-12-20', price: 21720, change: -0.85, volume: '35.2万吨' },
  { date: '2023-12-13', price: 21906, change: 0.62, volume: '33.8万吨' },
  { date: '2023-12-06', price: 21771, change: -1.25, volume: '36.5万吨' },
  { date: '2023-11-29', price: 22047, change: 1.05, volume: '34.1万吨' },
  { date: '2023-11-22', price: 21818, change: -0.55, volume: '32.7万吨' },
  { date: '2023-11-15', price: 21939, change: 0.78, volume: '35.9万吨' },
  { date: '2023-11-08', price: 21770, change: -1.32, volume: '36.3万吨' },
  { date: '2023-11-01', price: 22062, change: 1.42, volume: '33.5万吨' },
  { date: '2023-10-25', price: 21753, change: -0.95, volume: '34.8万吨' },
  { date: '2023-10-18', price: 21963, change: 0.35, volume: '35.0万吨' },
])

// 获取因素图标类型
const getFatorIconType = (trend) => {
  switch (trend) {
    case 'up': return 'CaretTop'
    case 'down': return 'CaretBottom'
    default: return 'TrendCharts'
  }
}

// 获取因素图标样式类
const getFatorIconClass = (trend) => {
  switch (trend) {
    case 'up': return 'trend-up'
    case 'down': return 'trend-down'
    default: return 'trend-neutral'
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  // 销毁之前的图表实例
  if (chart) {
    chart.dispose()
  }
  
  // 初始化图表
  chart = echarts.init(chartRef.value)
  
  // 根据当前选择的时间范围设置图表数据
  let chartData = []
  let xAxisData = []
  
  if (timeRange.value === 'month') {
    // 月度数据
    xAxisData = zincPriceTrend.value.labels
    chartData = zincPriceTrend.value.data
  } else if (timeRange.value === 'quarter') {
    // 季度数据 (这里为了演示简化处理)
    xAxisData = ['Q1', 'Q2', 'Q3', 'Q4']
    chartData = [22500, 23100, 22800, 21900]
  } else {
    // 年度数据
    xAxisData = ['2019', '2020', '2021', '2022', '2023']
    chartData = [25100, 22800, 24500, 23200, 22100]
  }
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br />锌价: {c} ¥/吨'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: '价格 (¥/吨)',
      nameTextStyle: {
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: '锌价',
        type: 'line',
        data: chartData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#409EFF'
        },
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.1)'
            }
          ])
        }
      }
    ]
  }
  
  // 设置图表选项并渲染
  chart.setOption(option)
}

// 监听时间范围变化，重新渲染图表
const handleTimeRangeChange = () => {
  initChart()
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

onMounted(() => {
  // 初始化图表
  initChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 监听时间范围变化
watch(timeRange, () => {
  handleTimeRangeChange()
})

// 在组件卸载前移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // 销毁图表
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.zinc-price {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.page-header {
  background: var(--primary-color);
  color: white;
  padding: 40px 0;
  text-align: center;
  width: 100%;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.header-content p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-card, .analysis-card, .data-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.chart-container {
  height: 400px;
  width: 100%;
}

.analysis-content {
  padding: 10px 0;
}

.summary {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.analysis-content h3 {
  margin: 25px 0 15px;
  color: var(--primary-color);
  font-size: 1.3rem;
}

.factor-item {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.factor-item:hover {
  transform: translateY(-3px);
}

.factor-icon {
  font-size: 24px;
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.up-trend {
  color: #67c23a;
}

.down-trend {
  color: #f56c6c;
}

.neutral-trend {
  color: #e6a23c;
}

.factor-content h4 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.factor-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.price-up {
  color: #67c23a;
  display: flex;
  align-items: center;
}

.price-down {
  color: #f56c6c;
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 992px) {
  .header-content h1 {
    font-size: 2rem;
  }

  .chart-container {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 1.8rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .time-range {
    width: 100%;
    margin-top: 10px;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .factor-item {
    flex-direction: column;
  }
  
  .factor-icon {
    margin-bottom: 10px;
    margin-right: 0;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 30px 0;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .header-content p {
    font-size: 1rem;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style> 