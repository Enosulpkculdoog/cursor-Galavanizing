/* eslint-disable */
<template>
  <div class="paper-detail">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面内容 -->
    <div class="main-content">
      <div class="container">
        <!-- 返回按钮 -->
        <div class="back-link">
          <el-button link @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            {{ $t('resources.papers.backToList') }}
          </el-button>
        </div>
        
        <!-- 论文标题和基本信息 -->
        <div class="paper-header">
          <h1 class="paper-title">{{ paper.title }}</h1>
          
          <div class="paper-meta">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ $t('resources.papers.authors') }}: {{ paper.authors }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ $t('resources.papers.publishDate') }}: {{ paper.publishDate }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Document /></el-icon>
              <span>{{ $t('resources.papers.journal') }}: {{ paper.journal }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Collection /></el-icon>
              <span>{{ $t('resources.papers.category') }}: {{ paper.category }}</span>
            </div>
          </div>
          
          <div class="paper-tags">
            <el-tag 
              v-for="(tag, index) in paper.tags" 
              :key="index" 
              class="tag"
              :type="tagTypes[index % tagTypes.length]"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <!-- 论文摘要 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.abstract') }}</h2>
          <div class="abstract">
            <p>{{ paper.abstract }}</p>
          </div>
        </div>
        
        <!-- 引言 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.introduction') }}</h2>
          <div class="content">
            <p v-for="(paragraph, index) in paper.introduction" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <!-- 方法 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.methods') }}</h2>
          <div class="content">
            <p v-for="(paragraph, index) in paper.methods" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <!-- 结果 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.results') }}</h2>
          <div class="content">
            <div v-for="(result, index) in paper.results" :key="index">
              <p>{{ result.text }}</p>
              <div v-if="result.image" class="result-image">
                <img :src="result.image" :alt="'Figure ' + (index + 1)">
                <div class="image-caption">{{ $t('resources.papers.figure') }} {{ index + 1 }}: {{ result.caption }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 讨论 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.discussion') }}</h2>
          <div class="content">
            <p v-for="(paragraph, index) in paper.discussion" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <!-- 结论 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.conclusion') }}</h2>
          <div class="content">
            <p v-for="(paragraph, index) in paper.conclusion" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <!-- 参考文献 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.references') }}</h2>
          <div class="references">
            <ol>
              <li v-for="(reference, index) in paper.references" :key="index">
                {{ reference }}
              </li>
            </ol>
          </div>
        </div>
        
        <!-- 相关论文 -->
        <div class="paper-section">
          <h2>{{ $t('resources.papers.relatedPapers') }}</h2>
          <div class="related-papers">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" v-for="(relatedPaper, index) in paper.relatedPapers" :key="index">
                <el-card class="related-paper-card" shadow="hover" @click="viewPaper(relatedPaper.id)">
                  <h3>{{ relatedPaper.title }}</h3>
                  <div class="related-paper-meta">
                    <span>{{ relatedPaper.authors }}</span>
                    <span>{{ relatedPaper.publishDate }}</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <!-- 下载和分享 -->
        <div class="paper-actions">
          <el-button type="primary" @click="downloadPaper">
            <el-icon><Download /></el-icon>
            {{ $t('resources.papers.downloadPDF') }}
          </el-button>
          <el-button type="success" @click="sharePaper">
            <el-icon><Share /></el-icon>
            {{ $t('resources.papers.share') }}
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, User, Calendar, Document, Collection, Download, Share } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const paperId = route.params.id

// 标签样式类型
const tagTypes = ['', 'success', 'warning', 'danger', 'info']

// 论文数据（通常会从API获取）
const paper = ref({
  id: paperId,
  title: '镀锌钢丝的耐腐蚀性能影响因素及提升方法研究',
  authors: '张三, 李四, 王五',
  publishDate: '2023-10-15',
  journal: '金属表面处理技术',
  category: '表面处理技术',
  tags: ['镀锌钢丝', '耐腐蚀性', '工艺优化', '表面处理'],
  abstract: '本研究系统分析了影响镀锌钢丝耐腐蚀性能的关键因素，包括镀锌工艺参数、锌层厚度分布、锌层微观结构等。通过正交试验设计，确定了最优工艺参数组合，实现了耐盐雾腐蚀时间提升30%以上。研究结果表明，锌层均匀性和合金化程度是影响耐腐蚀性的关键因素，基于此提出了系统的工艺优化方案。',
  introduction: [
    '镀锌钢丝作为重要的工业材料，广泛应用于建筑、电力、通信等领域。其耐腐蚀性能直接影响产品的使用寿命和应用安全性，因此提高镀锌钢丝的耐腐蚀性能具有重要的实用价值。',
    '现有研究主要集中在镀锌层厚度对耐腐蚀性的影响，但缺乏对镀锌工艺参数、锌层微观结构与耐腐蚀性之间关系的系统研究。本研究旨在通过实验和理论分析，探究镀锌钢丝耐腐蚀性能的影响因素，并提出有效的提升方法。'
  ],
  methods: [
    '本研究采用热浸镀锌工艺制备镀锌钢丝样品，通过调控镀锌温度(430-470℃)、浸锌时间(30-120s)、锌液成分等工艺参数，制备不同特性的镀锌层。',
    '采用盐雾试验(按GB/T 10125标准)、电化学阻抗谱(EIS)和极化曲线等测试方法评价样品的耐腐蚀性能。通过扫描电镜(SEM)、X射线衍射(XRD)和能谱分析(EDS)表征锌层的微观结构和成分分布。',
    '运用正交试验设计方法，研究不同工艺参数对镀锌层耐腐蚀性能的影响规律，并通过方差分析确定关键影响因素。'
  ],
  results: [
    {
      text: '盐雾试验结果表明，镀锌温度、浸锌时间和冷却速率对镀锌钢丝的耐腐蚀性能有显著影响。在450℃镀锌温度、90s浸锌时间和缓慢冷却条件下制备的样品表现出最佳的耐腐蚀性能，中性盐雾试验可达720小时无红锈。',
      image: 'https://placehold.co/600x400/2c3e50/fff?text=Salt+Spray+Test+Results',
      caption: '不同工艺参数下制备的镀锌钢丝样品盐雾试验结果对比'
    },
    {
      text: '微观结构分析显示，锌层与钢丝界面的Fe-Zn合金相厚度和分布均匀性对耐腐蚀性能有重要影响。合金相厚度适中(8-12μm)且分布均匀的样品具有更好的耐腐蚀性能。',
      image: 'https://placehold.co/600x400/3498db/fff?text=SEM+Analysis',
      caption: '镀锌层截面SEM形貌及EDS线扫描结果'
    },
    {
      text: '电化学测试结果表明，镀锌层的腐蚀电位和极化阻抗与其微观结构密切相关。添加0.1%Al的锌液制备的样品表现出更负的腐蚀电位和更大的极化阻抗，证实了适量Al元素可提高镀锌层的耐腐蚀性能。'
    }
  ],
  discussion: [
    '实验结果表明，镀锌工艺参数通过影响Fe-Zn合金相的形成和锌层表面特性而影响耐腐蚀性能。适当延长浸锌时间有助于形成厚度适中且均匀的Fe-Zn合金相，但过长的浸锌时间会导致脆性较大的Γ相过厚，反而降低耐腐蚀性能。',
    '锌液中添加适量Al元素可抑制Fe-Zn合金相的过度生长，并在锌层表面形成Al2O3保护膜，显著提高耐腐蚀性能。但Al含量超过0.2%时，会导致锌层与基体结合力下降，综合性能反而降低。',
    '冷却速率影响锌层的晶粒大小和致密度，缓慢冷却有利于形成更致密的锌层结构，提高耐腐蚀性能。但过慢的冷却速率会增加生产周期，降低生产效率，需要在实际应用中进行平衡。'
  ],
  conclusion: [
    '本研究通过系统实验和分析，明确了影响镀锌钢丝耐腐蚀性能的关键因素，提出了优化镀锌工艺的方法。研究结果表明：',
    '1. 镀锌温度、浸锌时间和冷却速率是影响镀锌钢丝耐腐蚀性能的主要工艺参数，450℃镀锌温度、90s浸锌时间和缓慢冷却的工艺组合可获得最佳耐腐蚀性能。',
    '2. Fe-Zn合金相的厚度和分布均匀性是决定耐腐蚀性能的关键微观结构因素，合金相厚度为8-12μm时表现出最佳性能。',
    '3. 锌液中添加0.1-0.2%的Al元素可有效提高镀锌层的耐腐蚀性能，主要通过抑制脆性合金相生长和形成表面保护膜实现。',
    '基于研究结果，建议在工业生产中采用优化的工艺参数组合，并通过精确控制锌液成分和冷却条件，提高镀锌钢丝的耐腐蚀性能和使用寿命。'
  ],
  references: [
    'Wang, L., Zhang, Y., & Liu, J. (2020). Effect of aluminum on the formation of intermetallic phases in hot-dip galvanized coatings. Surface and Coatings Technology, 385, 125382.',
    'Chen, Z. W., & Gregory, J. T. (2019). Microstructure and corrosion resistance of hot-dip galvanized steel wire. Corrosion Science, 157, 64-78.',
    'Smith, R. H., & Johnson, K. L. (2021). Optimization of galvanizing process parameters for enhanced corrosion resistance. Journal of Materials Engineering and Performance, 30(4), 2651-2665.',
    'Zhang, X., Li, W., & Wang, F. (2018). Influence of cooling rate on microstructure and corrosion behavior of hot-dip galvanized coating. Materials and Corrosion, 69(12), 1765-1779.',
    'Liu, H., Chen, S., & Zhang, C. (2022). Electrochemical behavior of Fe-Zn intermetallic compounds in hot-dip galvanized coatings. Electrochimica Acta, 412, 139982.'
  ],
  relatedPapers: [
    {
      id: '2',
      title: '镀锌钢丝的力学性能与镀锌工艺参数关系研究',
      authors: '李四, 王五',
      publishDate: '2023-08-10'
    },
    {
      id: '3',
      title: '新型环保镀锌工艺对钢丝表面质量的影响',
      authors: '赵六, 钱七',
      publishDate: '2023-06-22'
    },
    {
      id: '4',
      title: '镀锌钢丝在海洋环境中的腐蚀行为研究',
      authors: '孙八, 周九',
      publishDate: '2023-04-15'
    }
  ]
})

// 返回论文列表
const goBack = () => {
  router.push('/resources/papers')
}

// 查看相关论文
const viewPaper = (id) => {
  router.push(`/resources/papers/${id}`)
}

// 下载论文
const downloadPaper = () => {
  ElMessage.success(`开始下载论文: ${paper.value.title}`)
  // 实际应用中这里会调用下载API
}

// 分享论文
const sharePaper = () => {
  ElMessage.success('分享链接已复制到剪贴板')
  // 实际应用中这里会调用分享API
}

onMounted(() => {
  // 在实际应用中，这里会从API获取论文数据
  // fetchPaperDetail(paperId)
  console.log(`Fetching paper with ID: ${paperId}`)
})
</script>

<style scoped>
.paper-detail {
  background-color: var(--background-color);
  min-height: 100vh;
}

.main-content {
  padding: 30px 0 60px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-link {
  margin-bottom: 20px;
}

.paper-header {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.paper-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.3;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.95rem;
}

.meta-item .el-icon {
  margin-right: 8px;
  color: var(--primary-color);
}

.paper-tags {
  margin-top: 15px;
}

.tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.paper-section {
  margin-bottom: 40px;
}

.paper-section h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.abstract {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.abstract p {
  font-style: italic;
  color: #333;
  line-height: 1.6;
}

.content p {
  margin-bottom: 15px;
  line-height: 1.7;
  color: #333;
}

.result-image {
  margin: 20px 0;
  text-align: center;
}

.result-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-caption {
  margin-top: 10px;
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

.references ol {
  padding-left: 20px;
}

.references li {
  margin-bottom: 10px;
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

.related-papers {
  margin-top: 20px;
}

.related-paper-card {
  height: 100%;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.related-paper-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.related-paper-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.related-paper-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #666;
}

.paper-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
  justify-content: center;
}

@media (max-width: 768px) {
  .paper-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .paper-title {
    font-size: 1.6rem;
  }
  
  .paper-section h2 {
    font-size: 1.3rem;
  }
}
</style> 