/* eslint-disable */
<template>
  <div class="standards-page">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('standards.title') }}</h1>
        <p>{{ $t('standards.description') }}</p>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 标准分类 -->
      <div class="categories-section">
        <el-tabs v-model="activeCategory">
          <el-tab-pane 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :name="category.id"
          ></el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 标准列表 -->
      <div class="standards-list">
        <el-row :gutter="20">
          <el-col 
            v-for="standard in filteredStandards" 
            :key="standard.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
          >
            <el-card class="standard-card" shadow="hover" @click="viewStandardDetail(standard.id)">
              <div class="standard-header">
                <span class="standard-code">{{ standard.code }}</span>
                <el-tag size="small" :type="getStatusType(standard.status)">
                  {{ standard.status }}
                </el-tag>
              </div>
              <h3 class="standard-title">{{ standard.title }}</h3>
              <div class="standard-meta">
                <div class="meta-item">
                  <span>{{ $t('standards.publishDate') }}: {{ standard.publishDate }}</span>
                </div>
                <div class="meta-item">
                  <span>{{ $t('standards.implementDate') }}: {{ standard.implementDate }}</span>
                </div>
              </div>
              <div class="standard-desc">{{ standard.description }}</div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const totalItems = ref(0)

// 活动标签
const activeCategory = ref('all')

// 标准分类
const categories = ref([
  { id: 'all', name: '全部标准' },
  { id: 'national', name: '国家标准' },
  { id: 'industry', name: '行业标准' },
  { id: 'enterprise', name: '企业标准' },
  { id: 'international', name: '国际标准' }
])

// 标准数据（示例数据）
const standardsData = ref([
  {
    id: 1,
    code: 'GB/T 2231-2018',
    title: '镀锌钢丝',
    category: 'national',
    status: '现行',
    publishDate: '2018-07-15',
    implementDate: '2019-01-01',
    description: '规定了镀锌钢丝的技术要求、试验方法、检验规则及标志、包装、运输和贮存等。'
  },
  {
    id: 2,
    code: 'GB/T 4357-2017',
    title: '热浸镀锌钢丝及钢绞线',
    category: 'national',
    status: '现行',
    publishDate: '2017-05-20',
    implementDate: '2018-01-01',
    description: '规定了热浸镀锌钢丝及钢绞线的分类、技术要求、试验方法、检验规则、标志、包装、运输和储存。'
  },
  {
    id: 3,
    code: 'YB/T 5249-2016',
    title: '镀锌钢丝绳用钢丝',
    category: 'industry',
    status: '现行',
    publishDate: '2016-09-10',
    implementDate: '2017-03-01',
    description: '规定了镀锌钢丝绳用钢丝的技术要求、试验方法、检验规则、包装、标志和质量证明书。'
  },
  {
    id: 4,
    code: 'ISO 7989-2:2007',
    title: '钢丝和钢丝制品-非铁金属涂层钢丝 第2部分:锌或锌合金涂层',
    category: 'international',
    status: '现行',
    publishDate: '2007-11-15',
    implementDate: '2008-01-01',
    description: '规定了锌或锌合金涂层钢丝的一般特性、尺寸要求、力学性能、涂层要求以及试验方法。'
  },
  {
    id: 5,
    code: 'GB/T 20492-2006',
    title: '预应力混凝土用镀锌钢绞线',
    category: 'national',
    status: '现行',
    publishDate: '2006-12-14',
    implementDate: '2007-06-01',
    description: '规定了预应力混凝土用镀锌钢绞线的术语和定义、分类、技术要求、试验方法、检验规则及标志、包装、运输和贮存。'
  },
  {
    id: 6,
    code: 'YB/T 5039-2005',
    title: '高强度镀锌钢丝',
    category: 'industry',
    status: '现行',
    publishDate: '2005-08-18',
    implementDate: '2006-01-01',
    description: '规定了高强度镀锌钢丝的技术要求、试验方法、检验规则、包装和标志。'
  },
  {
    id: 7,
    code: 'ASTM A475-2019',
    title: '镀锌钢绞线标准规范',
    category: 'international',
    status: '现行',
    publishDate: '2019-03-01',
    implementDate: '2019-05-01',
    description: '规定了电力传输线和通信缆线用镀锌钢绞线的材料、制造工艺、尺寸和性能要求。'
  },
  {
    id: 8,
    code: 'GB/T 3428-2004',
    title: '镀锌低碳钢丝',
    category: 'national',
    status: '现行',
    publishDate: '2004-10-20',
    implementDate: '2005-04-01',
    description: '规定了镀锌低碳钢丝的分类、技术要求、试验方法、检验规则、包装、标志和质量证明书。'
  },
  {
    id: 9,
    code: 'JB/T 8358-2015',
    title: '镀锌钢丝绳',
    category: 'industry',
    status: '现行',
    publishDate: '2015-04-12',
    implementDate: '2015-10-01',
    description: '规定了镀锌钢丝绳的产品分类、技术要求、试验方法、检验规则、包装、标志和质量证明书。'
  },
  {
    id: 10,
    code: 'TR/JN 2023-001',
    title: '高耐蚀性能镀锌钢丝企业标准',
    category: 'enterprise',
    status: '现行',
    publishDate: '2023-01-15',
    implementDate: '2023-02-01',
    description: '规定了高耐蚀性能镀锌钢丝的技术要求、试验方法、检验规则等。适用于特殊环境下使用的镀锌钢丝产品。'
  },
  {
    id: 11,
    code: 'EN 10244-2:2009',
    title: '非铁金属涂层钢丝 第2部分:锌或锌合金涂层',
    category: 'international',
    status: '现行',
    publishDate: '2009-06-30',
    implementDate: '2009-08-15',
    description: '欧洲标准，规定了锌或锌合金涂层钢丝的涂层质量要求、涂层重量、附着性和均匀性测试方法。'
  },
  {
    id: 12,
    code: 'GB/T 22056-2008',
    title: '锌层厚度测定 称重法',
    category: 'national',
    status: '现行',
    publishDate: '2008-07-25',
    implementDate: '2009-01-01',
    description: '规定了测定镀锌钢丝锌层厚度的称重法的试验方法和计算方式。'
  }
])

// 根据当前选择的分类过滤标准
const filteredStandards = computed(() => {
  let filtered = standardsData.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory.value)
  }
  
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  return filtered.slice(startIndex, endIndex)
})

// 总条目数（移出计算属性）
const totalFilteredItems = computed(() => {
  let filtered = standardsData.value
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory.value)
  }
  
  return filtered.length
})

// 监听 totalFilteredItems 变化来更新 totalItems
watch(totalFilteredItems, (newValue) => {
  totalItems.value = newValue
})

// 分页处理函数
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 状态样式
const getStatusType = (status) => {
  switch (status) {
    case '现行': return 'success'
    case '即将实施': return 'warning'
    case '废止': return 'danger'
    default: return 'info'
  }
}

// 查看标准详情
const viewStandardDetail = (id) => {
  router.push(`/standards/${id}`)
}

// 监听分类变化，重置分页
watch(activeCategory, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.standards-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #1e88e5, #42a5f5);
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

.categories-section {
  margin-bottom: 30px;
}

.standards-list {
  margin-top: 20px;
}

.standard-card {
  height: 100%;
  margin-bottom: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.standard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.standard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.standard-code {
  font-family: monospace;
  color: #666;
  font-weight: bold;
}

.standard-title {
  font-size: 1.1rem;
  margin: 10px 0;
  color: var(--primary-color);
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.standard-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.meta-item {
  margin-bottom: 5px;
}

.standard-desc {
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 60px;
}

.pagination {
  margin-top: 30px;
  text-align: center;
}
</style> 