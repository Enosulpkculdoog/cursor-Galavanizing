/* eslint-disable */
<template>
  <div class="industry-solutions">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ $t('solutions.title') }}</h1>
      <p>{{ $t('solutions.description') }}</p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 行业导航 -->
      <div class="industry-nav">
        <el-menu
          :default-active="activeIndustry"
          class="industry-menu"
          @select="handleIndustrySelect"
        >
          <el-menu-item index="construction">
            <el-icon><House /></el-icon>
            <span>{{ $t('solutions.industries.construction') }}</span>
          </el-menu-item>
          <el-menu-item index="transportation">
            <el-icon><Van /></el-icon>
            <span>{{ $t('solutions.industries.transportation') }}</span>
          </el-menu-item>
          <el-menu-item index="energy">
            <el-icon><Lightning /></el-icon>
            <span>{{ $t('solutions.industries.energy') }}</span>
          </el-menu-item>
          <el-menu-item index="agriculture">
            <el-icon><Sunny /></el-icon>
            <span>{{ $t('solutions.industries.agriculture') }}</span>
          </el-menu-item>
          <el-menu-item index="industrial">
            <el-icon><Setting /></el-icon>
            <span>{{ $t('solutions.industries.industrial') }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 解决方案内容 -->
      <div class="solution-content">
        <!-- 建筑行业解决方案 -->
        <div v-show="activeIndustry === 'construction'" class="solution-section">
          <div class="solution-header">
            <h2>{{ $t('solutions.industries.construction') }}</h2>
            <p>{{ $t('solutions.industries.constructionDescription') }}</p>
          </div>
          
          <div class="solution-grid">
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><House /></el-icon>
                  <span>{{ $t('solutions.construction.reinforcement.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Construction+Reinforcement" alt="Construction Reinforcement" class="solution-image">
                <h3>{{ $t('solutions.construction.reinforcement.title') }}</h3>
                <p>{{ $t('solutions.construction.reinforcement.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.construction.reinforcement.feature1') }}</li>
                  <li>{{ $t('solutions.construction.reinforcement.feature2') }}</li>
                  <li>{{ $t('solutions.construction.reinforcement.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('construction-reinforcement')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
            
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Grid /></el-icon>
                  <span>{{ $t('solutions.construction.protectionNet.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Protection+Net" alt="Protection Net" class="solution-image">
                <h3>{{ $t('solutions.construction.protectionNet.title') }}</h3>
                <p>{{ $t('solutions.construction.protectionNet.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.construction.protectionNet.feature1') }}</li>
                  <li>{{ $t('solutions.construction.protectionNet.feature2') }}</li>
                  <li>{{ $t('solutions.construction.protectionNet.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('protection-net')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 交通运输解决方案 -->
        <div v-show="activeIndustry === 'transportation'" class="solution-section">
          <div class="solution-header">
            <h2>{{ $t('solutions.industries.transportation') }}</h2>
            <p>{{ $t('solutions.industries.transportationDescription') }}</p>
          </div>
          
          <div class="solution-grid">
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Road /></el-icon>
                  <span>{{ $t('solutions.transportation.guardrail.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Guardrail" alt="Guardrail" class="solution-image">
                <h3>{{ $t('solutions.transportation.guardrail.title') }}</h3>
                <p>{{ $t('solutions.transportation.guardrail.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.transportation.guardrail.feature1') }}</li>
                  <li>{{ $t('solutions.transportation.guardrail.feature2') }}</li>
                  <li>{{ $t('solutions.transportation.guardrail.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('guardrail')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
            
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Bridge /></el-icon>
                  <span>{{ $t('solutions.transportation.bridge.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Bridge+Reinforcement" alt="Bridge Reinforcement" class="solution-image">
                <h3>{{ $t('solutions.transportation.bridge.title') }}</h3>
                <p>{{ $t('solutions.transportation.bridge.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.transportation.bridge.feature1') }}</li>
                  <li>{{ $t('solutions.transportation.bridge.feature2') }}</li>
                  <li>{{ $t('solutions.transportation.bridge.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('bridge-reinforcement')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 能源电力解决方案 -->
        <div v-show="activeIndustry === 'energy'" class="solution-section">
          <div class="solution-header">
            <h2>{{ $t('solutions.industries.energy') }}</h2>
            <p>{{ $t('solutions.industries.energyDescription') }}</p>
          </div>
          
          <div class="solution-grid">
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Lightning /></el-icon>
                  <span>{{ $t('solutions.energy.powerline.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Power+Line" alt="Power Line" class="solution-image">
                <h3>{{ $t('solutions.energy.powerline.title') }}</h3>
                <p>{{ $t('solutions.energy.powerline.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.energy.powerline.feature1') }}</li>
                  <li>{{ $t('solutions.energy.powerline.feature2') }}</li>
                  <li>{{ $t('solutions.energy.powerline.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('power-line')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
            
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Connection /></el-icon>
                  <span>{{ $t('solutions.energy.grounding.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Grounding+System" alt="Grounding System" class="solution-image">
                <h3>{{ $t('solutions.energy.grounding.title') }}</h3>
                <p>{{ $t('solutions.energy.grounding.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.energy.grounding.feature1') }}</li>
                  <li>{{ $t('solutions.energy.grounding.feature2') }}</li>
                  <li>{{ $t('solutions.energy.grounding.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('grounding-system')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 农业设施解决方案 -->
        <div v-show="activeIndustry === 'agriculture'" class="solution-section">
          <div class="solution-header">
            <h2>{{ $t('solutions.industries.agriculture') }}</h2>
            <p>{{ $t('solutions.industries.agricultureDescription') }}</p>
          </div>
          
          <div class="solution-grid">
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Sunny /></el-icon>
                  <span>{{ $t('solutions.agriculture.greenhouse.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Greenhouse" alt="Greenhouse" class="solution-image">
                <h3>{{ $t('solutions.agriculture.greenhouse.title') }}</h3>
                <p>{{ $t('solutions.agriculture.greenhouse.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.agriculture.greenhouse.feature1') }}</li>
                  <li>{{ $t('solutions.agriculture.greenhouse.feature2') }}</li>
                  <li>{{ $t('solutions.agriculture.greenhouse.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('greenhouse')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
            
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Tools /></el-icon>
                  <span>{{ $t('solutions.agriculture.fence.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Fence+System" alt="Fence System" class="solution-image">
                <h3>{{ $t('solutions.agriculture.fence.title') }}</h3>
                <p>{{ $t('solutions.agriculture.fence.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.agriculture.fence.feature1') }}</li>
                  <li>{{ $t('solutions.agriculture.fence.feature2') }}</li>
                  <li>{{ $t('solutions.agriculture.fence.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('fence-system')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 工业制造解决方案 -->
        <div v-show="activeIndustry === 'industrial'" class="solution-section">
          <div class="solution-header">
            <h2>{{ $t('solutions.industries.industrial') }}</h2>
            <p>{{ $t('solutions.industries.industrialDescription') }}</p>
          </div>
          
          <div class="solution-grid">
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Setting /></el-icon>
                  <span>{{ $t('solutions.industrial.equipment.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Industrial+Equipment" alt="Industrial Equipment" class="solution-image">
                <h3>{{ $t('solutions.industrial.equipment.title') }}</h3>
                <p>{{ $t('solutions.industrial.equipment.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.industrial.equipment.feature1') }}</li>
                  <li>{{ $t('solutions.industrial.equipment.feature2') }}</li>
                  <li>{{ $t('solutions.industrial.equipment.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('industrial-equipment')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
            
            <el-card class="solution-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Tools /></el-icon>
                  <span>{{ $t('solutions.industrial.mechanical.title') }}</span>
                </div>
              </template>
              <div class="card-content">
                <img src="https://placehold.co/600x400?text=Mechanical+Parts" alt="Mechanical Parts" class="solution-image">
                <h3>{{ $t('solutions.industrial.mechanical.title') }}</h3>
                <p>{{ $t('solutions.industrial.mechanical.description') }}</p>
                <ul class="feature-list">
                  <li>{{ $t('solutions.industrial.mechanical.feature1') }}</li>
                  <li>{{ $t('solutions.industrial.mechanical.feature2') }}</li>
                  <li>{{ $t('solutions.industrial.mechanical.feature3') }}</li>
                </ul>
                <el-button type="primary" @click="viewSolutionDetail('mechanical-parts')">
                  {{ $t('solutions.learnMore') }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { House, Van, Lightning, Sunny, Setting, Connection, Tools, Road, Bridge, Grid } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const activeIndustry = ref('construction')

const handleIndustrySelect = (key) => {
  activeIndustry.value = key
}

const viewSolutionDetail = (solutionId) => {
  console.log('查看解决方案详情:', solutionId)
}
</script>

<style scoped>
.industry-solutions {
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;
}

/* 行业导航样式 */
.industry-nav {
  width: 250px;
  flex-shrink: 0;
}

.industry-menu {
  border-right: none;
  background-color: transparent;
}

.industry-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  border-radius: 8px;
}

.industry-menu .el-menu-item.is-active {
  background-color: var(--primary-color);
  color: white;
}

.industry-menu .el-menu-item .el-icon {
  margin-right: 10px;
}

/* 解决方案内容样式 */
.solution-content {
  flex: 1;
}

.solution-section {
  animation: fadeIn 0.5s;
}

.solution-section:first-child {
  display: block;
}

.solution-header {
  margin-bottom: 40px;
}

.solution-header h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 15px;
}

.solution-header p {
  color: #666;
  font-size: 1.1rem;
}

.solution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.solution-card {
  transition: transform 0.3s;
}

.solution-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.card-content {
  text-align: center;
}

.card-content img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-content h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.card-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.card-content li {
  margin-bottom: 8px;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .industry-nav {
    width: 100%;
  }
  
  .industry-menu {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .industry-menu .el-menu-item {
    flex-shrink: 0;
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .solution-grid {
    grid-template-columns: 1fr;
  }
  
  .card-content img {
    height: 150px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 