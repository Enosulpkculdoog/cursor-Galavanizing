/* eslint-disable */
<template>
  <div class="solutions-page">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('solutions.title') }}</h1>
        <p>{{ $t('solutions.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 行业解决方案 -->
      <div class="solutions-section">
        <h2 class="section-title">{{ $t('solutions.industryTitle') }}</h2>
        
        <el-row :gutter="30">
          <el-col 
            v-for="solution in industrySolutions" 
            :key="solution.id"
            :xs="24" 
            :sm="12" 
            :md="8"
          >
            <el-card class="solution-card" shadow="hover">
              <div class="solution-icon">
                <el-icon><component :is="solution.icon" /></el-icon>
              </div>
              <h3 class="solution-title">{{ solution.title }}</h3>
              <p class="solution-desc">{{ solution.description }}</p>
              <div class="solution-features">
                <h4>{{ $t('solutions.keyFeatures') }}</h4>
                <ul>
                  <li v-for="(feature, index) in solution.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <el-button type="primary" class="solution-button" @click="viewSolutionDetail(solution.id)">
                {{ $t('solutions.viewDetails') }}
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 技术解决方案 -->
      <div class="solutions-section">
        <h2 class="section-title">{{ $t('solutions.technicalTitle') }}</h2>
        
        <el-row :gutter="30">
          <el-col 
            v-for="solution in technicalSolutions" 
            :key="solution.id"
            :xs="24" 
            :sm="12" 
            :md="8"
          >
            <el-card class="solution-card" shadow="hover">
              <div class="solution-icon">
                <el-icon><component :is="solution.icon" /></el-icon>
              </div>
              <h3 class="solution-title">{{ solution.title }}</h3>
              <p class="solution-desc">{{ solution.description }}</p>
              <div class="solution-features">
                <h4>{{ $t('solutions.keyFeatures') }}</h4>
                <ul>
                  <li v-for="(feature, index) in solution.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <el-button type="primary" class="solution-button" @click="viewSolutionDetail(solution.id)">
                {{ $t('solutions.viewDetails') }}
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 成功案例 -->
      <div class="case-studies-section">
        <h2 class="section-title">{{ $t('solutions.caseStudiesTitle') }}</h2>
        
        <el-carousel :interval="5000" type="card" height="320px">
          <el-carousel-item v-for="caseStudy in caseStudies" :key="caseStudy.id">
            <el-card class="case-study-card">
              <div class="case-study-image">
                <img :src="caseStudy.image" :alt="caseStudy.title">
              </div>
              <div class="case-study-content">
                <h3>{{ caseStudy.title }}</h3>
                <div class="case-tags">
                  <el-tag v-for="(tag, index) in caseStudy.tags" :key="index" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
                <p>{{ caseStudy.summary }}</p>
                <el-button type="success" size="small" @click="viewCaseStudy(caseStudy.id)">
                  {{ $t('solutions.readMore') }}
                </el-button>
              </div>
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 联系部分 -->
      <div class="contact-section">
        <el-card class="contact-card">
          <h2>{{ $t('solutions.contactTitle') }}</h2>
          <p>{{ $t('solutions.contactDescription') }}</p>
          <el-button type="primary" size="large" @click="contactUs">
            {{ $t('solutions.contactUs') }}
          </el-button>
        </el-card>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()

// 行业解决方案
const industrySolutions = ref([
  {
    id: 1,
    title: '汽车工业镀锌解决方案',
    description: '针对汽车工业中对镀锌钢丝高耐蚀性、高强度要求，我们提供定制化的行业解决方案。',
    icon: 'Position',
    features: [
      '高强度镀锌处理工艺',
      '耐盐雾腐蚀性能提升50%',
      '汽车安全部件专用镀锌钢丝质量检测方案',
      '行业标准符合性验证'
    ]
  },
  {
    id: 2,
    title: '建筑行业镀锌解决方案',
    description: '为建筑行业提供符合国际标准的高质量镀锌钢丝解决方案，适用于各种建筑结构和预应力材料。',
    icon: 'Briefcase',
    features: [
      '预应力混凝土用镀锌钢丝生产工艺优化',
      '建筑用镀锌钢丝质量控制体系',
      '国际标准符合性验证',
      '长期耐久性评估方案'
    ]
  },
  {
    id: 3,
    title: '电力行业镀锌解决方案',
    description: '为电力传输线路提供高质量的镀锌钢绞线解决方案，满足高强度、长寿命、耐腐蚀的行业需求。',
    icon: 'Monitor',
    features: [
      '输电线路专用镀锌钢绞线优化方案',
      '高压输电线路导线防腐蚀处理',
      '电力设施镀锌层质量检测规范',
      '极端环境耐久性提升方案'
    ]
  }
])

// 技术解决方案
const technicalSolutions = ref([
  {
    id: 4,
    title: '镀锌层均匀性提升方案',
    description: '通过优化工艺参数和设备改进，显著提高镀锌层的均匀性，提升产品质量和使用寿命。',
    icon: 'Setting',
    features: [
      '镀锌液流动优化技术',
      '均匀性检测与反馈系统',
      '工艺参数精细化调控',
      '镀锌层厚度分布评估'
    ]
  },
  {
    id: 5,
    title: '节能环保镀锌工艺',
    description: '采用低温镀锌技术和废气处理系统，实现节能减排，降低生产成本，符合环保要求。',
    icon: 'Opportunity',
    features: [
      '低温镀锌技术应用方案',
      '能源消耗降低15-25%',
      '锌烟尘回收再利用系统',
      '废气处理达标排放解决方案'
    ]
  },
  {
    id: 6,
    title: '高耐蚀性镀锌优化方案',
    description: '针对特殊环境下使用的镀锌钢丝，提供高耐蚀性能解决方案，延长产品使用寿命。',
    icon: 'Cpu',
    features: [
      '合金化处理技术应用',
      '耐蚀性能提升30-50%',
      '表面处理工艺优化',
      '特殊环境适应性测试方案'
    ]
  }
])

// 成功案例
const caseStudies = ref([
  {
    id: 1,
    title: '某汽车制造商悬架系统镀锌钢丝质量提升项目',
    summary: '通过工艺优化和质量控制体系改进，帮助客户提高产品合格率达98.5%，降低生产成本12%，产品使用寿命延长30%。',
    image: 'https://placehold.co/600x400/2c3e50/fff?text=Case+Study+1',
    tags: ['汽车行业', '工艺优化', '质量提升']
  },
  {
    id: 2,
    title: '某电网公司输电线路镀锌钢绞线更新项目',
    summary: '为客户开发专用高耐蚀性镀锌钢绞线，在复杂气候条件下使用寿命提升40%，维护周期延长至5年，显著降低运维成本。',
    image: 'https://placehold.co/600x400/3498db/fff?text=Case+Study+2',
    tags: ['电力行业', '耐蚀性提升', '寿命延长']
  },
  {
    id: 3,
    title: '某建筑集团预应力混凝土结构用镀锌钢丝标准化项目',
    summary: '建立完整的建筑用镀锌钢丝标准体系和检测方案，帮助客户产品通过国际认证，成功打入高端市场，销售额提升35%。',
    image: 'https://placehold.co/600x400/e74c3c/fff?text=Case+Study+3',
    tags: ['建筑行业', '标准化', '国际认证']
  }
])

// 查看解决方案详情
const viewSolutionDetail = (id) => {
  router.push(`/solutions/${id}`)
}

// 查看案例研究
const viewCaseStudy = (id) => {
  router.push(`/case-studies/${id}`)
}

// 联系我们
const contactUs = () => {
  router.push('/contact')
}
</script>

<style scoped>
.solutions-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #2c3e50, #3498db);
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

.section-title {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.solutions-section {
  margin-bottom: 60px;
}

.solution-card {
  height: 100%;
  margin-bottom: 30px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.solution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.solution-icon {
  font-size: 40px;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
}

.solution-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #333;
}

.solution-desc {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.solution-features {
  margin-bottom: 25px;
}

.solution-features h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #444;
}

.solution-features ul {
  padding-left: 20px;
  color: #666;
}

.solution-features li {
  margin-bottom: 8px;
  line-height: 1.4;
}

.solution-button {
  display: block;
  width: 100%;
}

.case-studies-section {
  margin-bottom: 60px;
}

.case-study-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.case-study-image {
  height: 180px;
  overflow: hidden;
}

.case-study-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-study-content {
  padding: 15px;
}

.case-study-content h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.case-tags {
  margin-bottom: 10px;
}

.case-tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.case-study-content p {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.contact-section {
  text-align: center;
}

.contact-card {
  padding: 30px;
}

.contact-card h2 {
  font-size: 1.6rem;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.contact-card p {
  color: #666;
  max-width: 700px;
  margin: 0 auto 25px;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style> 