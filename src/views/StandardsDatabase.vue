<template>
  <div class="standards-database">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ $t('standards.title') }}</h1>
      <p>{{ $t('standards.subtitle') }}</p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              :placeholder="$t('standards.search.keyword')"
              prefix-icon="Search"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.category" :placeholder="$t('standards.search.category')" clearable>
              <el-option :label="$t('standards.categories.international')" value="international" />
              <el-option :label="$t('standards.categories.national')" value="national" />
              <el-option :label="$t('standards.categories.industry')" value="industry" />
              <el-option :label="$t('standards.categories.enterprise')" value="enterprise" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.region" :placeholder="$t('standards.search.region')" clearable>
              <el-option :label="$t('standards.regions.global')" value="global" />
              <el-option :label="$t('standards.regions.china')" value="china" />
              <el-option :label="$t('standards.regions.eu')" value="eu" />
              <el-option :label="$t('standards.regions.usa')" value="usa" />
              <el-option :label="$t('standards.regions.japan')" value="japan" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              {{ $t('common.search') }}
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 标准列表 -->
      <div class="standards-list">
        <el-table
          :data="standardsList"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="code" :label="$t('standards.table.code')" width="180" />
          <el-table-column prop="name" :label="$t('standards.table.name')" min-width="300" />
          <el-table-column prop="category" :label="$t('standards.table.category')" width="120">
            <template #default="scope">
              <el-tag :type="getCategoryType(scope.row.category)">
                {{ getCategoryText(scope.row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="region" :label="$t('standards.table.region')" width="100" />
          <el-table-column prop="publishDate" :label="$t('standards.table.publishDate')" width="120" />
          <el-table-column prop="status" :label="$t('standards.table.status')" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('standards.table.operation')" width="150" fixed="right">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="viewStandard(scope.row.id)"
              >
                {{ $t('common.view') }}
              </el-button>
              <el-button 
                type="primary" 
                link
                @click="downloadStandard(scope.row.id)"
              >
                {{ $t('common.download') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- 标准详情对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="$t('standards.detail.title')"
        width="60%"
        :destroy-on-close="true"
      >
        <div v-if="currentStandard" class="standard-detail">
          <div class="detail-header">
            <h2>{{ currentStandard.name }}</h2>
            <div class="detail-meta">
              <el-tag :type="getCategoryType(currentStandard.category)">
                {{ getCategoryText(currentStandard.category) }}
              </el-tag>
              <span class="standard-code">{{ $t('standards.table.code') }}：{{ currentStandard.code }}</span>
              <span class="publish-date">{{ $t('standards.table.publishDate') }}：{{ currentStandard.publishDate }}</span>
            </div>
          </div>
          
          <div class="detail-content">
            <h3>{{ $t('standards.detail.summary') }}</h3>
            <p>{{ currentStandard.summary }}</p>
            
            <h3>{{ $t('standards.detail.scope') }}</h3>
            <p>{{ currentStandard.scope }}</p>
            
            <h3>{{ $t('standards.detail.requirements') }}</h3>
            <ul>
              <li v-for="(requirement, index) in currentStandard.requirements" 
                  :key="index">
                {{ requirement }}
              </li>
            </ul>
            
            <h3>{{ $t('standards.detail.testMethods') }}</h3>
            <ul>
              <li v-for="(method, index) in currentStandard.testMethods" 
                  :key="index">
                {{ method }}
              </li>
            </ul>
            
            <h3>{{ $t('standards.detail.relatedStandards') }}</h3>
            <ul>
              <li v-for="(related, index) in currentStandard.relatedStandards" 
                  :key="index">
                {{ related }}
              </li>
            </ul>
          </div>
          
          <div class="detail-footer">
            <el-button type="primary" @click="downloadStandard(currentStandard.id)">
              {{ $t('standards.detail.download') }}
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

/* eslint-disable */
<script setup>
import { ref, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 搜索表单
const searchForm = ref({
  keyword: '',
  category: '',
  region: ''
})

// 标准列表数据
const standardsList = ref([
  {
    id: 1,
    code: 'ISO 1461',
    name: '钢铁制品热镀锌层技术要求',
    category: 'international',
    region: '全球',
    publishDate: '2023-01-01',
    status: 'active',
    summary: '本标准规定了钢铁制品热镀锌层的技术要求、试验方法和检验规则。',
    scope: '适用于钢铁制品的热镀锌层。',
    requirements: [
      '镀层厚度要求',
      '表面质量要求',
      '附着力要求',
      '耐腐蚀性要求'
    ],
    testMethods: [
      '镀层厚度测量方法',
      '表面质量检验方法',
      '附着力试验方法',
      '耐腐蚀性试验方法'
    ],
    relatedStandards: [
      'ISO 1462',
      'ISO 1463'
    ]
  },
  {
    id: 2,
    code: 'GB/T 13912',
    name: '金属覆盖层 钢铁制品热镀锌层技术要求',
    category: 'national',
    region: '中国',
    publishDate: '2023-03-20',
    status: 'active',
    summary: '本标准规定了钢铁制品热镀锌层的技术要求、试验方法和检验规则。',
    scope: '适用于钢铁制品的热镀锌层。',
    requirements: [
      '镀层厚度要求',
      '表面质量要求',
      '附着力要求',
      '耐腐蚀性要求'
    ],
    testMethods: [
      '镀层厚度测量方法',
      '表面质量检验方法',
      '附着力试验方法',
      '耐腐蚀性试验方法'
    ],
    relatedStandards: [
      'GB/T 13913',
      'GB/T 13914'
    ]
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const currentStandard = ref(null)

// 获取类别类型
const getCategoryType = (category) => {
  const typeMap = {
    international: 'success',
    national: 'warning',
    industry: 'info',
    enterprise: ''
  }
  return typeMap[category] || ''
}

// 获取类别文本
const getCategoryText = (category) => {
  if (category === 'international') return t('standards.categories.international')
  if (category === 'national') return t('standards.categories.national')
  if (category === 'industry') return t('standards.categories.industry')
  if (category === 'enterprise') return t('standards.categories.enterprise')
  return category
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    active: 'success',
    draft: 'warning',
    obsolete: 'info'
  }
  return typeMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  if (status === 'active') return t('standards.status.active')
  if (status === 'draft') return t('standards.status.draft')
  if (status === 'obsolete') return t('standards.status.obsolete')
  return status
}

// 处理搜索
const handleSearch = () => {
  loading.value = true
  // 这里添加实际的搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    category: '',
    region: ''
  }
  handleSearch()
}

// 查看标准详情
const viewStandard = (id) => {
  currentStandard.value = standardsList.value.find(item => item.id === id)
  dialogVisible.value = true
}

// 下载标准
const downloadStandard = (id) => {
  // 实现下载标准的逻辑
  console.log('下载标准:', id)
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 页面挂载时加载数据
onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.standards-database {
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
}

/* 搜索区域样式 */
.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 标准列表样式 */
.standards-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 标准详情样式 */
.standard-detail {
  padding: 20px;
}

.detail-header {
  margin-bottom: 30px;
}

.detail-header h2 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
}

.standard-code,
.publish-date {
  font-size: 0.9rem;
}

.detail-content {
  margin-bottom: 30px;
}

.detail-content h3 {
  color: var(--primary-color);
  margin: 20px 0 10px;
  font-size: 1.2rem;
}

.detail-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.detail-content ul {
  list-style: none;
  padding-left: 20px;
}

.detail-content li {
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
  position: relative;
}

.detail-content li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: -20px;
}

.detail-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .search-form .el-form-item {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .detail-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style> 