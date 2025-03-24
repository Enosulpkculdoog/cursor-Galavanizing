/* eslint-disable */
<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('about.title') }}</h1>
        <p>{{ $t('about.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-card class="about-card">
        <h2>{{ $t('about.companyTitle') }}</h2>
        <p>江阴天润钢丝镀锌量信息平台是专注于为钢丝镀锌行业提供全方位技术服务的专业平台。我们致力于提供最新的技术指导、标准解读、质量检测和行业解决方案，以促进行业技术进步和质量提升。</p>
        
        <h3>{{ $t('about.mission') }}</h3>
        <p>提供专业、权威、全面的钢丝镀锌技术服务，促进行业技术进步和发展。</p>
        
        <h3>{{ $t('about.vision') }}</h3>
        <p>成为钢丝镀锌行业最具影响力的技术服务平台，引领行业技术创新和标准制定。</p>
      </el-card>
      
      <el-card class="about-card">
        <h2>{{ $t('about.serviceTitle') }}</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="(service, index) in services" :key="index">
            <div class="service-item">
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
      
      <el-card class="about-card">
        <h2>{{ $t('about.contactTitle') }}</h2>
        <div class="contact-info">
          <p><strong>{{ $t('about.address') }}:</strong> 江苏省江阴市高新区金融六街</p>
          <p><strong>{{ $t('about.phone') }}:</strong> 0510-86198888</p>
          <p><strong>{{ $t('about.email') }}:</strong> contact@zinc-coating.com</p>
        </div>
      </el-card>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavHeader from '@/components/NavHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

// 服务项目
const services = ref([
  {
    title: '技术指导',
    description: '提供镀锌生产工艺优化、技术问题咨询以及新技术应用指导服务。'
  },
  {
    title: '标准解读',
    description: '解读国内外钢丝镀锌相关标准，提供标准符合性评估和指导。'
  },
  {
    title: '质量检测',
    description: '提供专业的镀锌层厚度、附着力、均匀性等各项指标检测服务。'
  },
  {
    title: '行业培训',
    description: '组织行业技术培训，提升技术人员专业水平和操作技能。'
  },
  {
    title: '研发合作',
    description: '与企业合作开展新型镀锌工艺、装备的研发和应用推广。'
  },
  {
    title: '信息共享',
    description: '定期发布行业技术动态、市场分析和发展趋势报告。'
  }
]);
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
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

.about-card {
  margin-bottom: 30px;
  border-radius: 8px;
}

.about-card h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.about-card h3 {
  margin: 25px 0 10px;
  color: #333;
}

.about-card p {
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.service-item {
  height: 100%;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 20px;
}

.service-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.service-item h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.contact-info {
  margin-top: 10px;
}

.contact-info p {
  margin-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .service-item {
    margin-bottom: 15px;
  }
}
</style> 