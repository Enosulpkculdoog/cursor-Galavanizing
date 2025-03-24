/* eslint-disable */
<template>
  <div class="papers">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('resources.papers.title') }}</h1>
        <p>{{ $t('resources.papers.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 搜索和筛选 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('resources.papers.searchPlaceholder')"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <div class="filters">
          <el-select 
            v-model="selectedCategory" 
            :placeholder="$t('resources.papers.categoryPlaceholder')"
            class="filter-select"
            clearable
          >
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          
          <el-select 
            v-model="selectedYear" 
            :placeholder="$t('resources.papers.yearPlaceholder')"
            class="filter-select"
            clearable
          >
            <el-option
              v-for="year in years"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
          
          <el-button type="primary" @click="searchPapers">
            {{ $t('resources.papers.search') }}
          </el-button>
        </div>
      </div>
      
      <!-- 论文展示 -->
      <div class="papers-grid">
        <el-card
          v-for="paper in filteredPapers"
          :key="paper.id"
          class="paper-card"
          shadow="hover"
        >
          <div class="paper-category">
            <el-tag :type="getCategoryTagType(paper.category)">{{ paper.category }}</el-tag>
            <span class="paper-date">{{ paper.publishDate }}</span>
          </div>
          <h3 class="paper-title">{{ paper.title }}</h3>
          <p class="paper-authors">
            <el-icon><User /></el-icon> {{ paper.authors.join(', ') }}
          </p>
          <p class="paper-journal">
            <el-icon><Collection /></el-icon> {{ paper.journal }}
          </p>
          <div class="paper-abstract">
            <p>{{ paper.abstract }}</p>
          </div>
          <div class="paper-actions">
            <el-button type="primary" plain @click="viewPaperDetail(paper.id)">
              {{ $t('resources.papers.readOnline') }}
            </el-button>
            <el-button @click="downloadPaper(paper.id)">
              <el-icon><Download /></el-icon> {{ $t('resources.papers.download') }}
            </el-button>
          </div>
        </el-card>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="totalPapers"
          :page-size="pageSize"
          :page-sizes="[6, 12, 24, 48]"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
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
import { Search, User, Collection, Download } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { ElMessage } from 'element-plus'

// eslint-disable-next-line
const store = useStore()
const router = useRouter()

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedYear = ref('')

// 论文数据
const papers = ref([
  {
    id: 1,
    title: '高速钢丝热浸镀锌工艺参数优化研究',
    authors: ['张明', '李铭'],
    journal: '金属表面处理',
    publishDate: '2023-09-15',
    category: '工艺优化',
    year: 2023,
    abstract: '本研究通过正交试验设计和数值模拟，系统研究了高速钢丝热浸镀锌过程中的工艺参数对镀层厚度、均匀性及附着力的影响。结果表明，提高镀锌温度和延长浸渍时间可显著提高镀层质量，但同时增加能耗。通过多目标优化，得到了最佳工艺参数组合，实现了镀层性能与能耗的平衡。'
  },
  {
    id: 2,
    title: '预涂助镀剂对镀锌层结构的影响机理',
    authors: ['王建国', '刘伟'],
    journal: '材料科学与工艺',
    publishDate: '2023-07-22',
    category: '材料科学',
    year: 2023,
    abstract: '本文研究了不同类型预涂助镀剂对热镀锌层金相组织结构的影响。采用扫描电镜和X射线衍射分析了界面反应层的组成和厚度变化。研究发现，含铝助镀剂能有效抑制Fe-Zn脆性相的生长，促进η相形成，从而提高镀层韧性和耐腐蚀性。'
  },
  {
    id: 3,
    title: '连续镀锌线中锌锅温度场数值模拟与优化',
    authors: ['陈学明', '赵鹏'],
    journal: '热处理技术',
    publishDate: '2022-11-30',
    category: '设备技术',
    year: 2022,
    abstract: '基于计算流体动力学原理，本文建立了连续镀锌线锌锅三维温度场模型。通过有限元分析，模拟了不同加热方式对锌锅温度分布的影响。研究结果表明，优化加热器布局和采用分区控温技术可将温度波动降低50%，提高镀层厚度一致性。'
  },
  {
    id: 4,
    title: '新型环保型助镀剂在热镀锌中的应用研究',
    authors: ['孙芳', '张志强'],
    journal: '表面技术',
    publishDate: '2022-09-08',
    category: '环保技术',
    year: 2022,
    abstract: '本文开发了一种不含氯化铵的新型环保助镀剂，研究了其在热镀锌工艺中的应用效果。结果表明，该助镀剂在保证镀层质量的同时，显著降低了氨氮排放和酸雾产生，符合绿色制造要求。通过工业试验验证，该助镀剂可替代传统氯化铵助镀剂。'
  },
  {
    id: 5,
    title: '钢丝镀锌层厚度在线检测技术的研究进展',
    authors: ['李明', '王浩'],
    journal: '检测技术与仪器',
    publishDate: '2023-04-12',
    category: '检测技术',
    year: 2023,
    abstract: '本文综述了钢丝镀锌层厚度在线检测的最新技术进展，包括电磁感应法、X射线荧光法、激光干涉法等。对比分析了各种检测方法的精度、稳定性和适用范围。研究表明，结合深度学习算法的多传感器融合技术是目前最有前景的发展方向，可实现更高精度的厚度实时监测。'
  },
  {
    id: 6,
    title: '热浸镀锌层防腐性能的长期跟踪研究',
    authors: ['张伟', '刘明'],
    journal: '腐蚀科学与防护技术',
    publishDate: '2022-05-20',
    category: '性能研究',
    year: 2022,
    abstract: '本研究对不同环境条件下热浸镀锌层防腐性能进行了为期10年的跟踪测试。通过电化学阻抗谱和盐雾试验等方法，系统评估了镀层腐蚀行为和使用寿命。结果表明，含铝量1.5%的镀锌层在海洋环境中具有更长的防护期，而含铁合金化层对酸性工业环境更有效。'
  }
])

// 论文分类
const categories = [
  { value: '工艺优化', label: '工艺优化' },
  { value: '材料科学', label: '材料科学' },
  { value: '设备技术', label: '设备技术' },
  { value: '环保技术', label: '环保技术' },
  { value: '检测技术', label: '检测技术' },
  { value: '性能研究', label: '性能研究' }
]

// 论文年份
const years = [2023, 2022, 2021, 2020, 2019]

// 分页相关
const currentPage = ref(1)
const pageSize = ref(6)
const totalPapers = computed(() => filteredPapers.value.length)

// 根据搜索条件过滤论文
const filteredPapers = computed(() => {
  return papers.value.filter(paper => {
    // 标题或摘要包含搜索关键词
    const matchesQuery = searchQuery.value === '' || 
      paper.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 符合所选分类
    const matchesCategory = selectedCategory.value === '' || 
      paper.category === selectedCategory.value
    
    // 符合所选年份
    const matchesYear = selectedYear.value === '' || 
      paper.year === selectedYear.value
    
    return matchesQuery && matchesCategory && matchesYear
  })
})

// 根据分类获取标签类型
const getCategoryTagType = (category) => {
  const tagMap = {
    '工艺优化': 'primary',
    '材料科学': 'success',
    '设备技术': 'warning',
    '环保技术': 'success',
    '检测技术': 'info',
    '性能研究': 'danger'
  }
  
  return tagMap[category] || 'info'
}

// 搜索论文
const searchPapers = () => {
  // 重置分页
  currentPage.value = 1
}

// 查看论文详情
const viewPaperDetail = (paperId) => {
  router.push(`/resources/papers/${paperId}`)
}

// 下载论文
const downloadPaper = (paperId) => {
  ElMessage({
    message: '论文下载已开始，请稍等...',
    type: 'success'
  })
  
  // 实际应用中这里应当调用API下载文件
  console.log(`Downloading paper ID: ${paperId}`)
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

onMounted(() => {
  // 可以在这里从API获取论文数据
})
</script>

<style scoped>
.papers {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #3d5afe, #3949ab);
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

/* 搜索区域样式 */
.search-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-input {
  margin-bottom: 15px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-select {
  width: 200px;
}

/* 论文网格样式 */
.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.paper-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s;
}

.paper-card:hover {
  transform: translateY(-5px);
}

.paper-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.paper-date {
  color: #909399;
  font-size: 0.9rem;
}

.paper-title {
  font-size: 1.3rem;
  margin: 0 0 15px;
  color: var(--primary-color);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.paper-authors, .paper-journal {
  display: flex;
  align-items: center;
  margin: 8px 0;
  color: #606266;
}

.paper-authors .el-icon, .paper-journal .el-icon {
  margin-right: 8px;
}

.paper-abstract {
  margin: 15px 0;
  flex-grow: 1;
}

.paper-abstract p {
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.paper-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .papers-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style> 