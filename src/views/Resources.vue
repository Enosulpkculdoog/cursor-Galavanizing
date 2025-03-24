/* eslint-disable */
<template>
  <div class="resources">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ $t('resources.title') }}</h1>
      <p>{{ $t('resources.description') }}</p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 资源导航卡片 -->
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="resource in resourceTypes" :key="resource.id">
          <el-card class="resource-card" @click="navigateTo(resource.route)">
            <div class="resource-icon">
              <el-icon><component :is="getIconComponent(resource.icon)" /></el-icon>
            </div>
            <div class="resource-content">
              <h2>{{ resource.title }}</h2>
              <p>{{ resource.description }}</p>
              <el-button type="primary" class="resource-button">
                {{ $t('common.view') }}
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 最新更新 -->
      <div class="latest-updates">
        <h2>{{ $t('resources.latestUpdates') }}</h2>
        <el-timeline>
          <el-timeline-item
            v-for="update in latestUpdates"
            :key="update.id"
            :timestamp="update.date"
            :type="update.type"
          >
            <el-card class="update-card">
              <h3>{{ update.title }}</h3>
              <p>{{ update.description }}</p>
              <el-button 
                type="primary" 
                link 
                @click="navigateTo(update.route)"
              >
                {{ $t('common.view') }}
              </el-button>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Reading, Histogram, ChatLineRound, TrendCharts, ArrowRight } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()

// 资源类型数据
const resourceTypes = ref([
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

// 最新更新数据
const latestUpdates = ref([
  {
    id: 1,
    title: '2023年全球钢丝镀锌量行业分析报告发布',
    description: '最新的行业分析报告现已发布，包含市场趋势、技术进展和未来展望。',
    date: '2023-12-15',
    type: 'primary',
    route: '/resources/annual-report'
  },
  {
    id: 2,
    title: '新型镀锌层厚度在线检测设备的开发',
    description: '最新研究论文详细介绍了基于激光干涉原理的新型镀锌层厚度在线检测设备。',
    date: '2023-10-05',
    type: 'info',
    route: '/resources/papers'
  },
  {
    id: 3,
    title: '12月锌价分析报告',
    description: '最新锌价市场分析报告，包含价格趋势与预测。',
    date: '2023-12-10',
    type: 'success',
    route: '/resources/zinc-price'
  }
])

// 获取对应的图标组件
const getIconComponent = (iconName) => {
  const iconMap = {
    'Document': Document,
    'Reading': Reading,
    'Histogram': Histogram,
    'ChatLineRound': ChatLineRound,
    'TrendCharts': TrendCharts
  }
  return iconMap[iconName]
}

// 导航到指定路由
const navigateTo = (route) => {
  router.push(route)
}

onMounted(() => {
  // 页面挂载时可以加载一些数据
})
</script>

<style scoped>
.resources {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 资源卡片样式 */
.resource-card {
  margin-bottom: 30px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.resource-icon {
  font-size: 40px;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
}

.resource-content {
  text-align: center;
}

.resource-content h2 {
  font-size: 1.6rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.resource-content p {
  color: #666;
  margin-bottom: 20px;
  min-height: 3em;
}

.resource-button {
  margin-top: 10px;
}

/* 最新更新样式 */
.latest-updates {
  margin-top: 60px;
}

.latest-updates h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.update-card {
  margin-bottom: 10px;
}

.update-card h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .resource-content p {
    min-height: auto;
  }
}
</style> 