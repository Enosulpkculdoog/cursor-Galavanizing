<template>
  <div class="home">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 轮播图 -->
      <div class="banner-container">
        <el-carousel height="500px" class="banner">
          <el-carousel-item v-for="(item, index) in bannerItems" :key="item.id">
            <div class="banner-content" :style="{ backgroundImage: `url(${item.image})` }">
              <div class="banner-overlay"></div>
              <div class="banner-text">
                <h2>{{ $t(`home.banner.title${index+1}`) }}</h2>
                <p>{{ $t(`home.banner.description${index+1}`) }}</p>
                <el-button type="primary" size="large" class="banner-btn">{{ $t('home.learnMore') }}</el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 功能区块 -->
      <div class="section-wrapper">
        <div class="container">
          <div class="section-title">
            <h2>{{ $t('home.services') }}</h2>
            <div class="section-divider"></div>
          </div>
          <div class="features">
            <el-row :gutter="30">
              <el-col :xs="24" :sm="12" :md="6" v-for="feature in features" :key="feature.id">
                <el-card class="feature-card" @click="navigateTo(feature.route)" shadow="hover">
                  <div class="feature-icon-container">
                    <el-icon class="feature-icon">
                      <component :is="getIconComponent(feature.icon)" />
                    </el-icon>
                  </div>
                  <h3>{{ $t(`home.features.${feature.key}.title`) }}</h3>
                  <p>{{ $t(`home.features.${feature.key}.description`) }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
        
      <!-- 最新标准 -->
      <div class="section-wrapper light-bg">
        <div class="container">
          <div class="latest-standards">
            <div class="section-header">
              <h2>{{ $t('home.latestStandards') }}</h2>
              <el-button type="primary" @click="$router.push('/standards-database')">
                {{ $t('home.viewAll') }}
              </el-button>
            </div>
            <div class="table-container">
              <el-table :data="latestStandards" style="width: 100%">
                <el-table-column prop="code" :label="$t('standards.table.code')" min-width="120" />
                <el-table-column prop="name" :label="$t('standards.table.name')" min-width="200" />
                <el-table-column prop="publishDate" :label="$t('standards.table.publishDate')" min-width="120" />
                <el-table-column :label="$t('standards.table.operation')" width="100" fixed="right">
                  <template #default="scope">
                    <el-button 
                      type="primary" 
                      link
                      @click="viewStandard(scope.row.id)"
                    >
                      {{ $t('common.view') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
        
      <!-- 行业解决方案 -->
      <div class="section-wrapper dark-bg">
        <div class="container">
          <div class="industry-solutions">
            <div class="section-header">
              <h2>{{ $t('home.industrySolutions') }}</h2>
              <el-button type="primary" @click="$router.push('/industry-solutions')">
                {{ $t('home.viewAll') }}
              </el-button>
            </div>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :lg="8" v-for="solution in industrySolutions" :key="solution.id">
                <el-card class="solution-card">
                  <img :src="solution.image" :alt="$t(`solutions.industries.${solution.key}`)" class="solution-image">
                  <div class="solution-content">
                    <h3>{{ $t(`solutions.industries.${solution.key}`) }}</h3>
                    <p>{{ solution.description }}</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
        
      <!-- 行业资源 -->
      <div class="section-wrapper light-bg">
        <div class="container">
          <div class="industry-resources">
            <div class="section-header">
              <h2>{{ $t('home.industryResources') }}</h2>
              <el-button type="primary" @click="$router.push('/resources')">
                {{ $t('home.viewAll') }}
              </el-button>
            </div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8" v-for="resource in industryResources" :key="resource.id">
                <el-card class="resource-card" @click="navigateToResource(resource.route)">
                  <div class="resource-icon">
                    <el-icon><component :is="getIconComponent(resource.icon)" /></el-icon>
                  </div>
                  <div class="resource-content">
                    <h3>{{ resource.title }}</h3>
                    <p>{{ resource.description }}</p>
                  </div>
                  <div class="resource-footer">
                    <el-button type="primary" text>{{ $t('common.view') }}<el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

/* eslint-disable */
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DataAnalysis, Service, Reading, Tools, Document, Histogram, DataLine, ChatLineRound, TrendCharts, ArrowRight } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// 轮播图数据
const bannerItems = ref([
  {
    id: 1,
    image: require('@/assets/images/public/images/dx1.png')
  },
  {
    id: 2,
    image: require('@/assets/images/public/images/dx2.png')
  },
  { 
    id: 3,
    image: require('@/assets/images/public/images/dx3.png')
  }
])

// 功能区块数据
const features = ref([
  {
    id: 1,
    key: 'technicalGuide',
    icon: 'Reading',
    route: '/technical-guide'
  },
  {
    id: 2,
    key: 'testingService',
    icon: 'Service',
    route: '/testing-service'
  },
  {
    id: 3,
    key: 'standardsDatabase',
    icon: 'DataAnalysis',
    route: '/standards-database'
  },
  {
    id: 4,
    key: 'industrySolutions',
    icon: 'Tools',
    route: '/industry-solutions'
  }
])

// 最新标准数据
const latestStandards = ref([])

// 行业解决方案数据
const industrySolutions = ref([
  {
    id: 1,
    key: 'construction',
    description: t('home.solutions.constructionDesc'),
    image: 'https://placehold.co/400x300?text=Construction'
  },
  {
    id: 2,
    key: 'transportation',
    description: t('home.solutions.transportationDesc'),
    image: 'https://placehold.co/400x300?text=Transportation'
  },
  {
    id: 3,
    key: 'energy',
    description: t('home.solutions.energyDesc'),
    image: 'https://placehold.co/400x300?text=Energy'
  }
])

// 行业资源数据
const industryResources = ref([
  {
    id: 1,
    title: '镀锌量年度报告',
    description: '权威发布的钢丝镀锌行业年度分析报告',
    icon: 'Document',
    route: '/resources/annual-report'
  },
  {
    id: 2,
    title: '镀锌技术论文库',
    description: '收录国内外镀锌工艺技术研究论文',
    icon: 'Reading',
    route: '/resources/papers'
  },
  {
    id: 3,
    title: '行业数据看板',
    description: '镀锌行业实时数据统计与分析',
    icon: 'Histogram',
    route: '/resources/data-dashboard'
  },
  {
    id: 4,
    title: '专家问答社区',
    description: '专业工程师在线解答技术难题',
    icon: 'ChatLineRound',
    route: '/resources/expert-qa'
  },
  {
    id: 5,
    title: '锌价变动趋势',
    description: '锌市场价格走势分析与预测',
    icon: 'TrendCharts',
    route: '/resources/zinc-price'
  }
])

// 方法
const navigateTo = (route) => {
  router.push(route)
}

const navigateToResource = (route) => {
  router.push(route)
}

const viewStandard = (id) => {
  router.push(`/standards-database/${id}`)
}

// 获取对应的图标组件
const getIconComponent = (iconName) => {
  const iconMap = {
    'Reading': Reading,
    'Service': Service,
    'DataAnalysis': DataAnalysis,
    'Tools': Tools,
    'Document': Document,
    'Histogram': Histogram,
    'DataLine': DataLine,
    'ChatLineRound': ChatLineRound,
    'TrendCharts': TrendCharts
  }
  return iconMap[iconName]
}

// 生命周期钩子
onMounted(async () => {
  // 获取最新标准数据
  await store.dispatch('fetchStandards', { limit: 5 })
  latestStandards.value = store.getters.standards
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  width: 100%;
}

.section-wrapper {
  width: 100%;
  padding: 40px 0;
}

.light-bg {
  background-color: #f5f7fa;
}

.dark-bg {
  background-color: #eef2f6;
}

.container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  margin: 20px 0 25px;
}

.section-title h2 {
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 15px;
}

.section-divider {
  height: 4px;
  width: 80px;
  background-color: var(--accent-color);
  margin: 0 auto;
  border-radius: 2px;
}

.banner-container {
  width: 100%;
  background-color: #f5f7fa;
  padding: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 0;
  overflow: hidden;
}

.banner {
  width: 100%;
  max-width: 1600px;
}

.banner-content {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  border-radius: 0;
  padding: 0 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6));
  border-radius: 0;
}

.banner-text {
  position: relative;
  padding: 30px 40px;
  border-radius: 10px;
  max-width: 600px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.banner-text h2 {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.banner-text p {
  font-size: 1.2em;
  margin-bottom: 25px;
  line-height: 1.5;
  opacity: 0.9;
}

.banner-btn {
  font-size: 1.1em;
  padding: 12px 30px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.features {
  margin: 20px 0 30px;
  width: 100%;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 20px;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon-container {
  background-color: rgba(64, 158, 255, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
}

.feature-icon {
  font-size: 40px;
  color: var(--primary-color);
}

.latest-standards {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 15px;
}

.section-header h2 {
  color: var(--primary-color);
  font-size: 1.6rem;
  margin: 0;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
}

.latest-standards .el-table {
  border-radius: 8px;
  overflow: hidden;
}

.latest-standards .el-button--primary.is-link {
  font-weight: 500;
}

.latest-standards .el-button--primary.is-link:hover {
  opacity: 0.8;
}

/* 行业解决方案区域 */
.industry-solutions {
  width: 100%;
}

.solution-card {
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.solution-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.solution-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.solution-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.solution-card h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1.3rem;
}

.solution-card p {
  color: #666;
  line-height: 1.6;
}

/* 行业资源样式 */
.industry-resources {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.resource-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.resource-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.resource-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.resource-content {
  flex: 1;
}

.resource-content h3 {
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-bottom: 15px;
  font-weight: 600;
}

.resource-content p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

.resource-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式布局 */
@media (max-width: 1300px) {
  .banner {
    max-width: 100%;
  }
}

@media (max-width: 1200px) {
  .container {
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 95%;
  }
  
  .banner-text {
    max-width: 550px;
    padding: 25px 30px;
  }
  
  .banner-text h2 {
    font-size: 2.2em;
  }
  
  .banner-text p {
    font-size: 1.1em;
  }
  
  .section-title h2 {
    font-size: 1.8rem;
  }
  
  .solution-image {
    height: 180px;
  }
  
  .resource-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .section-wrapper {
    padding: 30px 0;
  }
  
  .banner {
    height: 380px !important;
  }
  
  .banner-text {
    max-width: 450px;
    padding: 20px 25px;
  }
  
  .banner-text h2 {
    font-size: 1.8em;
  }
  
  .banner-text p {
    font-size: 1em;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .section-title h2 {
    font-size: 1.6rem;
  }
  
  .latest-standards {
    padding: 20px 15px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 12px;
  }
  
  .section-wrapper {
    padding: 25px 0;
  }
  
  .banner {
    height: 320px !important;
  }
  
  .banner-text {
    max-width: 320px;
    padding: 18px 20px;
  }
  
  .banner-text h2 {
    font-size: 1.6em;
    margin-bottom: 10px;
  }
  
  .banner-text p {
    font-size: 0.95em;
    margin-bottom: 18px;
  }
  
  .banner-btn {
    font-size: 0.95em;
    padding: 8px 18px;
  }
  
  .industry-resources {
    padding: 20px 15px;
  }
}
</style> 