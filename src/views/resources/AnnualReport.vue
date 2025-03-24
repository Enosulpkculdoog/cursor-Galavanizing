/* eslint-disable */
<template>
  <div class="annual-report">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('resources.annualReport.title') }}</h1>
        <p>{{ $t('resources.annualReport.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 年度筛选 -->
      <div class="filter-section">
        <el-radio-group v-model="selectedYear" size="large" @change="handleYearChange">
          <el-radio-button v-for="year in availableYears" :key="year" :label="year">
            {{ year }}{{ $t('resources.annualReport.yearLabel') }}
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 报告概览 -->
      <div class="report-overview">
        <el-row :gutter="30">
          <!-- 报告封面 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="7">
            <div class="report-cover">
              <img :src="currentReport.coverImage" :alt="currentReport.title" class="cover-image">
              <div class="report-actions">
                <el-button type="primary" class="action-button" @click="downloadReport">
                  <el-icon><Download /></el-icon>
                  {{ $t('resources.annualReport.download') }}
                </el-button>
                <el-button type="success" class="action-button" @click="viewOnline">
                  <el-icon><View /></el-icon>
                  {{ $t('resources.annualReport.viewOnline') }}
                </el-button>
              </div>
            </div>
          </el-col>
          
          <!-- 报告信息 -->
          <el-col :xs="24" :sm="24" :md="16" :lg="17">
            <div class="report-info">
              <h2 class="report-title">{{ currentReport.title }}</h2>
              
              <div class="report-meta">
                <div class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ $t('resources.annualReport.publishDate') }}: {{ currentReport.publishDate }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><Document /></el-icon>
                  <span>{{ $t('resources.annualReport.pages') }}: {{ currentReport.pages }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><Download /></el-icon>
                  <span>{{ $t('resources.annualReport.downloads') }}: {{ currentReport.downloads }}</span>
                </div>
              </div>
              
              <div class="report-summary">
                <h3>{{ $t('resources.annualReport.summary') }}</h3>
                <p>{{ currentReport.summary }}</p>
              </div>
              
              <div class="report-highlights">
                <h3>{{ $t('resources.annualReport.highlights') }}</h3>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12" :md="8" v-for="(highlight, index) in currentReport.highlights" :key="index">
                    <div class="highlight-item">
                      <el-icon class="highlight-icon"><component :is="getHighlightIcon(highlight.type)" /></el-icon>
                      <div class="highlight-content">
                        <h4>{{ highlight.title }}</h4>
                        <p>{{ highlight.content }}</p>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 报告内容预览 -->
      <div class="report-content-preview">
        <h3 class="section-title">{{ $t('resources.annualReport.contentPreview') }}</h3>
        
        <el-collapse v-model="activeChapters">
          <el-collapse-item 
            v-for="(chapter, index) in currentReport.tableOfContents" 
            :key="index"
            :title="chapter.title"
            :name="index"
          >
            <div class="chapter-content">
              <div v-if="chapter.description" class="chapter-description">
                <p>{{ chapter.description }}</p>
              </div>
              
              <div v-if="chapter.subchapters && chapter.subchapters.length > 0" class="subchapters">
                <div v-for="(subchapter, subIndex) in chapter.subchapters" :key="subIndex" class="subchapter-item">
                  <h5>{{ subchapter.title }}</h5>
                  <p v-if="subchapter.description">{{ subchapter.description }}</p>
                </div>
              </div>
              
              <div v-if="chapter.image" class="chapter-image">
                <img :src="chapter.image" :alt="chapter.title">
                <div class="image-caption">{{ chapter.imageCaption }}</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      
      <!-- 过往报告 -->
      <div class="past-reports">
        <h3 class="section-title">{{ $t('resources.annualReport.pastReports') }}</h3>
        
        <el-table :data="pastReports" style="width: 100%" row-class-name="report-row">
          <el-table-column prop="year" :label="$t('resources.annualReport.year')" width="100" />
          <el-table-column prop="title" :label="$t('resources.annualReport.title')" />
          <el-table-column prop="publishDate" :label="$t('resources.annualReport.publishDate')" width="180" />
          <el-table-column :label="$t('resources.annualReport.operation')" width="230">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="selectReport(scope.row.year)"
              >
                {{ $t('resources.annualReport.view') }}
              </el-button>
              <el-button 
                type="success" 
                link
                @click="downloadSpecificReport(scope.row.year)"
              >
                {{ $t('resources.annualReport.download') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, View, Calendar, Document, TrendCharts, DataLine, Histogram, Odometer, Opportunity } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

// eslint-disable-next-line
const store = useStore()

// eslint-disable-next-line
const router = useRouter()

// 年份选择
const selectedYear = ref(2023)
const availableYears = [2023, 2022, 2021, 2020, 2019]

// 展开的章节
const activeChapters = ref([0, 1]) // 默认展开前两个章节

// 报告数据
const reportsData = ref({
  2023: {
    id: 1,
    year: 2023,
    title: '2023年全球钢丝镀锌行业年度分析报告',
    coverImage: 'https://placehold.co/300x400/2c3e50/fff?text=2023+Annual+Report',
    publishDate: '2023-12-15',
    pages: 187,
    downloads: 3642,
    summary: '本报告全面分析了2023年全球钢丝镀锌行业的发展状况、市场需求变化和技术创新趋势。报告显示，尽管受到全球经济波动的影响，全球镀锌钢丝市场仍保持了2.8%的增长率，其中亚太地区增长尤为显著。报告还重点分析了绿色环保镀锌技术的普及进展、高性能镀锌产品的研发动态，以及各主要市场的政策环境变化对行业的影响。',
    highlights: [
      {
        title: '市场增长',
        content: '全球镀锌钢丝市场规模达到487亿美元，同比增长2.8%',
        type: 'trend'
      },
      {
        title: '产能分布',
        content: '亚太地区占全球产能的58.3%，较去年提升2.1个百分点',
        type: 'distribution'
      },
      {
        title: '技术创新',
        content: '低温镀锌技术应用率提升15%，能耗降低约12.5%',
        type: 'innovation'
      },
      {
        title: '环保投入',
        content: '行业环保技术投入同比增长32%，废气排放降低18%',
        type: 'environment'
      },
      {
        title: '应用领域',
        content: '新能源领域对高性能镀锌钢丝需求增长最快，达35.7%',
        type: 'application'
      },
      {
        title: '价格趋势',
        content: '镀锌钢丝平均价格同比下降4.2%，但高端产品价格保持稳定',
        type: 'price'
      }
    ],
    tableOfContents: [
      {
        title: '第一章：全球镀锌钢丝市场概况',
        description: '本章概述了全球镀锌钢丝市场的整体规模、增长趋势和区域分布情况，同时分析了影响市场的宏观经济因素。',
        subchapters: [
          { title: '1.1 全球市场规模与增长趋势' },
          { title: '1.2 主要区域市场分析' },
          { title: '1.3 行业价值链分析' }
        ],
        image: 'https://placehold.co/600x300/4299e1/fff?text=Market+Overview',
        imageCaption: '图1.1 全球镀锌钢丝市场规模（2019-2023）'
      },
      {
        title: '第二章：生产技术发展与创新',
        description: '本章详细分析了镀锌钢丝生产技术的最新发展和创新趋势，包括节能环保技术、高效生产工艺和质量控制方法。',
        subchapters: [
          { title: '2.1 主流镀锌工艺对比分析' },
          { title: '2.2 低温镀锌技术的应用与效益' },
          { title: '2.3 自动化与智能化生产的进展' }
        ]
      },
      {
        title: '第三章：应用领域分析',
        description: '本章重点分析了镀锌钢丝在各应用领域的市场需求、技术要求和发展趋势，特别关注新兴应用领域的增长潜力。',
        subchapters: [
          { title: '3.1 传统应用领域需求变化' },
          { title: '3.2 新能源领域的应用拓展' },
          { title: '3.3 高端应用市场分析' }
        ]
      },
      {
        title: '第四章：区域市场深度分析',
        subchapters: [
          { title: '4.1 亚太市场分析' },
          { title: '4.2 欧洲市场分析' },
          { title: '4.3 北美市场分析' },
          { title: '4.4 其他地区市场分析' }
        ]
      },
      {
        title: '第五章：主要企业分析',
        subchapters: [
          { title: '5.1 全球头部企业运营情况' },
          { title: '5.2 区域领先企业分析' },
          { title: '5.3 创新型企业案例研究' }
        ]
      },
      {
        title: '第六章：行业展望与策略建议',
        subchapters: [
          { title: '6.1 未来五年市场预测' },
          { title: '6.2 技术发展趋势展望' },
          { title: '6.3 企业战略发展建议' }
        ]
      }
    ]
  },
  2022: {
    id: 2,
    year: 2022,
    title: '2022年全球钢丝镀锌行业发展报告',
    coverImage: 'https://placehold.co/300x400/3498db/fff?text=2022+Annual+Report',
    publishDate: '2022-12-10',
    pages: 172,
    downloads: 5218,
    summary: '本报告系统分析了2022年全球钢丝镀锌行业的发展情况。研究显示，随着全球经济从疫情中逐步恢复，镀锌钢丝市场需求回暖，全年增长率达到2.3%。报告特别关注了能源成本上升对行业的影响，以及各国在碳减排背景下对镀锌行业的新要求和企业的应对措施。报告还分析了行业集中度变化、新兴市场机会和主要企业的战略调整。',
    highlights: [
      {
        title: '市场规模',
        content: '全球镀锌钢丝市场规模达到473亿美元，同比增长2.3%',
        type: 'trend'
      },
      {
        title: '能源影响',
        content: '能源成本上升导致生产成本增加7.5%，但通过工艺优化部分抵消',
        type: 'price'
      },
      {
        title: '区域变化',
        content: '东南亚地区产能扩张最快，全球占比提升1.8个百分点',
        type: 'distribution'
      },
      {
        title: '行业整合',
        content: '全球发生35起并购事件，行业集中度CR10提升2.1%',
        type: 'innovation'
      }
    ],
    tableOfContents: [
      {
        title: '第一章：行业发展概况',
        subchapters: [
          { title: '1.1 全球宏观经济环境分析' },
          { title: '1.2 镀锌钢丝市场规模与结构' },
          { title: '1.3 区域市场发展情况' }
        ]
      },
      // 后续章节内容省略...
    ]
  }
})

// 计算当前报告数据
const currentReport = computed(() => {
  return reportsData.value[selectedYear.value] || {}
})

// 过往报告列表
const pastReports = computed(() => {
  return availableYears
    .filter(year => year !== selectedYear.value)
    .map(year => ({
      year,
      title: reportsData.value[year]?.title || `${year}年钢丝镀锌行业年度报告`,
      publishDate: reportsData.value[year]?.publishDate || `${year}-12-01`
    }))
})

// 获取亮点对应的图标
const getHighlightIcon = (type) => {
  const iconMap = {
    'trend': TrendCharts,
    'distribution': DataLine,
    'innovation': Opportunity,
    'environment': Histogram,
    'application': Document,
    'price': Odometer
  }
  return iconMap[type] || Document
}

// 切换年份
const handleYearChange = (year) => {
  selectedYear.value = year
  // 重置展开的章节
  activeChapters.value = [0, 1]
}

// 选择过往报告
const selectReport = (year) => {
  selectedYear.value = year
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 下载当前报告
const downloadReport = () => {
  ElMessage({
    message: `开始下载 ${currentReport.value.title}`,
    type: 'success'
  })
  
  // 模拟下载操作
  console.log(`Downloading report for year ${selectedYear.value}`)
}

// 下载特定年份报告
const downloadSpecificReport = (year) => {
  ElMessage({
    message: `开始下载 ${year}年度报告`,
    type: 'success'
  })
  
  // 模拟下载操作
  console.log(`Downloading report for year ${year}`)
}

// 在线查看报告
const viewOnline = () => {
  // 跳转到在线查看页面
  console.log(`View online report for year ${selectedYear.value}`)
}

onMounted(() => {
  // 可以在这里从API获取报告数据
  // 例如: store.dispatch('fetchAnnualReports')
})
</script>

<style scoped>
.annual-report {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #e65100, #f57c00);
  color: white;
  padding: 40px 20px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2.2rem;
  margin-bottom: 15px;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 800px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

/* 年份筛选样式 */
.filter-section {
  margin-bottom: 30px;
  text-align: center;
}

/* 报告概览样式 */
.report-overview {
  margin-bottom: 40px;
}

.report-cover {
  margin-bottom: 20px;
}

.cover-image {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  width: 100%;
  max-width: 300px;
}

.report-title {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  line-height: 1.3;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #666;
}

.meta-item .el-icon {
  margin-right: 8px;
  color: var(--primary-color);
}

.report-summary {
  margin-bottom: 30px;
}

.report-summary h3, .report-highlights h3 {
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.report-summary p {
  line-height: 1.6;
  color: #333;
}

/* 亮点样式 */
.highlight-item {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.highlight-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.highlight-icon {
  font-size: 24px;
  margin-right: 15px;
  color: var(--primary-color);
  padding-top: 5px;
}

.highlight-content h4 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: #333;
}

.highlight-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

/* 报告内容预览样式 */
.report-content-preview, .past-reports {
  margin-top: 50px;
}

.section-title {
  font-size: 1.6rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.chapter-content {
  padding: 10px 0 20px;
}

.chapter-description {
  margin-bottom: 20px;
  color: #333;
  line-height: 1.6;
}

.subchapters {
  padding-left: 20px;
  border-left: 3px solid #eee;
  margin-bottom: 20px;
}

.subchapter-item {
  margin-bottom: 15px;
}

.subchapter-item h5 {
  font-size: 1.05rem;
  margin: 0 0 8px;
  color: #444;
}

.subchapter-item p {
  color: #666;
  font-size: 0.95rem;
}

.chapter-image {
  margin-top: 20px;
  text-align: center;
}

.chapter-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.image-caption {
  margin-top: 10px;
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

/* 过往报告表格样式 */
.report-row {
  cursor: pointer;
}

.report-row:hover td {
  background-color: #f9f9f9;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .report-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-button {
    max-width: 100%;
  }
}
</style> 