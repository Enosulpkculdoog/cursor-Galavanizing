<template>
  <div class="data-dashboard">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('resources.dataDashboard.title') }}</h1>
        <p>{{ $t('resources.dataDashboard.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="dashboard-container">
        <!-- 过滤器和控制面板 -->
        <div class="dashboard-controls">
          <el-card shadow="never" class="filter-card">
            <div class="filter-header">
              <h3>{{ $t('resources.dataDashboard.filters') }}</h3>
            </div>
            <div class="filter-body">
              <el-form :inline="true" class="filter-form">
                <el-form-item :label="$t('resources.dataDashboard.dateRange')">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    :start-placeholder="$t('resources.dataDashboard.startDate')"
                    :end-placeholder="$t('resources.dataDashboard.endDate')"
                    :shortcuts="dateShortcuts"
                  />
                </el-form-item>
                <el-form-item :label="$t('resources.dataDashboard.dataType')">
                  <el-select v-model="selectedDataType" class="filter-select">
                    <el-option
                      v-for="type in dataTypes"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="applyFilters">
                    {{ $t('resources.dataDashboard.apply') }}
                  </el-button>
                  <el-button @click="resetFilters">
                    {{ $t('resources.dataDashboard.reset') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
        
        <!-- 数据卡片区域 -->
        <div class="dashboard-metrics">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6" v-for="(metric, index) in metrics" :key="index">
              <el-card shadow="hover" class="metric-card">
                <div class="metric-icon">
                  <el-icon><component :is="metric.icon" /></el-icon>
                </div>
                <div class="metric-data">
                  <h3>{{ metric.label }}</h3>
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-change" :class="{ 'positive': metric.change > 0, 'negative': metric.change < 0 }">
                    {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 图表区域 -->
        <div class="dashboard-charts">
          <el-row :gutter="20">
            <el-col :xs="24" :md="12">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <h3>{{ $t('resources.dataDashboard.productionTrend') }}</h3>
                    <el-radio-group v-model="productionChartPeriod" size="small">
                      <el-radio-button label="week">{{ $t('resources.dataDashboard.week') }}</el-radio-button>
                      <el-radio-button label="month">{{ $t('resources.dataDashboard.month') }}</el-radio-button>
                      <el-radio-button label="year">{{ $t('resources.dataDashboard.year') }}</el-radio-button>
                    </el-radio-group>
                  </div>
                </template>
                <div class="chart-container">
                  <!-- 生产趋势图表 -->
                  <div ref="productionChart" class="chart"></div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <h3>{{ $t('resources.dataDashboard.qualityMetrics') }}</h3>
                    <el-select v-model="selectedQualityMetric" size="small" class="chart-select">
                      <el-option
                        v-for="option in qualityMetricOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </div>
                </template>
                <div class="chart-container">
                  <!-- 质量指标图表 -->
                  <div ref="qualityChart" class="chart"></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 数据表格区域 -->
        <div class="dashboard-table">
          <el-card shadow="hover" class="table-card">
            <template #header>
              <div class="table-header">
                <h3>{{ $t('resources.dataDashboard.detailedData') }}</h3>
                <el-button size="small" type="success" @click="exportData">
                  <el-icon><Download /></el-icon>
                  {{ $t('resources.dataDashboard.exportData') }}
                </el-button>
              </div>
            </template>
            <el-table
              :data="tableData"
              style="width: 100%"
              height="400"
              border
            >
              <el-table-column prop="date" :label="$t('resources.dataDashboard.date')" width="180" />
              <el-table-column prop="productionVolume" :label="$t('resources.dataDashboard.productionVolume')" width="180" />
              <el-table-column prop="qualityRate" :label="$t('resources.dataDashboard.qualityRate')" width="180" />
              <el-table-column prop="zincConsumption" :label="$t('resources.dataDashboard.zincConsumption')" width="180" />
              <el-table-column prop="energyConsumption" :label="$t('resources.dataDashboard.energyConsumption')" />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download, TrendCharts, DataLine, Monitor, Odometer } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
// 这里可以引入图表库，如 echarts 等

// 日期过滤器
const dateRange = ref([])
const selectedDataType = ref('all')
const dataTypes = ref([
  { label: '全部数据', value: 'all' },
  { label: '生产数据', value: 'production' },
  { label: '质量数据', value: 'quality' },
  { label: '能耗数据', value: 'energy' }
])

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 指标卡片数据
const metrics = ref([
  {
    label: '总产量 (吨)',
    value: '5,280',
    change: 12.5,
    icon: TrendCharts
  },
  {
    label: '合格率 (%)',
    value: '98.7',
    change: 1.2,
    icon: DataLine
  },
  {
    label: '锌消耗 (吨)',
    value: '320',
    change: -5.3,
    icon: Monitor
  },
  {
    label: '能耗指数',
    value: '0.85',
    change: -3.6,
    icon: Odometer
  }
])

// 图表相关
const productionChartPeriod = ref('month')
const selectedQualityMetric = ref('defect-rate')
const qualityMetricOptions = ref([
  { label: '缺陷率', value: 'defect-rate' },
  { label: '镀锌厚度', value: 'zinc-thickness' },
  { label: '附着力', value: 'adhesion' }
])

// 表格数据
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// 初始化数据
onMounted(() => {
  // 模拟获取数据
  initTableData()
  // 初始化图表
  // initCharts()
})

// 初始化表格数据
const initTableData = () => {
  // 模拟数据
  const mockData = []
  const today = new Date()
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      productionVolume: Math.floor(Math.random() * 100 + 150),
      qualityRate: (95 + Math.random() * 4).toFixed(2),
      zincConsumption: Math.floor(Math.random() * 20 + 10),
      energyConsumption: (0.8 + Math.random() * 0.4).toFixed(2)
    })
  }
  
  tableData.value = mockData
  totalItems.value = mockData.length
}

// 过滤器应用
const applyFilters = () => {
  // 应用过滤条件并更新数据
  console.log('应用过滤条件', dateRange.value, selectedDataType.value)
  // 这里实现过滤逻辑
}

// 重置过滤器
const resetFilters = () => {
  dateRange.value = []
  selectedDataType.value = 'all'
  initTableData()
}

// 导出数据
const exportData = () => {
  console.log('导出数据')
  // 实现导出逻辑
}

// 处理分页
const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.data-dashboard {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.header-content p {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.9;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-container {
  margin-top: -20px;
}

.dashboard-controls {
  margin-bottom: 20px;
}

.filter-card {
  border-radius: 8px;
  background-color: white;
}

.filter-header {
  margin-bottom: 16px;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.filter-body {
  display: flex;
  flex-wrap: wrap;
}

.filter-select {
  width: 180px;
}

.dashboard-metrics {
  margin-bottom: 20px;
}

.metric-card {
  height: 120px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: transform 0.3s;
  padding: 15px;
  overflow: hidden;
  position: relative;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 2.5rem;
  margin-right: 15px;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 50%;
}

.metric-data {
  flex-grow: 1;
}

.metric-data h3 {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.metric-change {
  font-size: 0.9rem;
  margin-top: 5px;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.positive {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.negative {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
}

.chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.chart-select {
  width: 140px;
}

.chart-container {
  height: 300px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
}

.large-chart {
  height: 400px;
}

.chart-row {
  margin-top: 20px;
}

.table-card {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.table-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.pagination-container {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-header > * {
    margin-bottom: 10px;
  }
  
  .filter-form {
    flex-direction: column;
  }
}
</style> 