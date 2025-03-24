/* eslint-disable */
<template>
  <div class="standard-detail">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ $t('standards.detail.title') }}</h1>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content" v-if="standard">
      <!-- 标准基本信息 -->
      <div class="standard-info">
        <div class="standard-code">{{ standard.code }}</div>
        <h2 class="standard-name">{{ standard.name }}</h2>
        <div class="standard-meta">
          <span class="meta-item">
            <el-tag>{{ standard.region }}</el-tag>
          </span>
          <span class="meta-item">
            <el-tag type="success">{{ standard.category }}</el-tag>
          </span>
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            {{ standard.publishDate }}
          </span>
        </div>
      </div>
      
      <!-- 标准详情内容 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('standards.detail.summary') }}</span>
          </div>
        </template>
        <div class="card-content">
          <p>{{ standard.description }}</p>
        </div>
      </el-card>
      
      <el-tabs class="detail-tabs">
        <el-tab-pane :label="$t('standards.detail.scope')" name="scope">
          <div class="tab-content">
            <h3>{{ $t('standards.detail.scope') }}</h3>
            <p>{{ standardDetails.scope }}</p>
          </div>
        </el-tab-pane>
        
        <el-tab-pane :label="$t('standards.detail.requirements')" name="requirements">
          <div class="tab-content">
            <h3>{{ $t('standards.detail.requirements') }}</h3>
            <div v-html="standardDetails.requirements"></div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane :label="$t('standards.detail.testMethods')" name="testMethods">
          <div class="tab-content">
            <h3>{{ $t('standards.detail.testMethods') }}</h3>
            <div v-html="standardDetails.testMethods"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 相关标准 -->
      <div class="related-standards">
        <h3>{{ $t('standards.detail.relatedStandards') }}</h3>
        <el-table :data="relatedStandards" style="width: 100%">
          <el-table-column prop="code" :label="$t('standards.table.code')" width="180" />
          <el-table-column prop="name" :label="$t('standards.table.name')" />
          <el-table-column prop="region" :label="$t('standards.table.region')" width="120" />
          <el-table-column :label="$t('standards.table.operation')" width="120">
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
      
      <!-- 下载按钮 -->
      <div class="download-section">
        <el-button type="primary" size="large" @click="downloadStandard">
          <el-icon><Download /></el-icon>
          {{ $t('standards.detail.download') }}
        </el-button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-state" v-else>
      <el-skeleton :rows="6" animated />
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Calendar, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const standard = ref(null)
const standardDetails = ref({
  scope: '',
  requirements: '',
  testMethods: ''
})
const relatedStandards = ref([])

// 根据不同标准ID加载不同的详情内容
const loadStandardDetails = (id) => {
  // 这里实际应用中应该是从API获取数据
  // 这里使用模拟数据演示
  const detailsMap = {
    1: {
      scope: 'ISO 1461标准规定了成品钢铁制品完全或部分热浸镀锌层的特性和试验方法，适用于铁碳合金材质的制品。',
      requirements: `<h4>主要技术要求：</h4>
        <ul>
          <li>表面质量要求：镀锌表面应光滑、连续、无有害缺陷</li>
          <li>最小镀层厚度：根据钢材厚度不同，要求不同的最小局部镀层厚度和平均镀层厚度</li>
          <li>附着力要求：镀锌层应牢固附着在基体上</li>
        </ul>`,
      testMethods: `<h4>测试方法：</h4>
        <ul>
          <li>镀层厚度测量：磁性测厚仪法、显微截面法</li>
          <li>附着力测试：锤击试验、弯曲试验</li>
          <li>外观检查：目视检查</li>
        </ul>`
    },
    2: {
      scope: 'ASTM A123标准规定了成型后热浸镀锌的钢材产品的锌涂层要求，适用于各种形状和尺寸的钢制品。',
      requirements: `<h4>主要技术要求：</h4>
        <ul>
          <li>镀锌重量：按照产品厚度分为不同等级，规定最小镀锌量</li>
          <li>表面光洁度：涂层应光滑、连续，不得有锌瘤或其他会影响产品使用的缺陷</li>
          <li>涂层均匀性：涂层应均匀覆盖产品表面</li>
        </ul>`,
      testMethods: `<h4>测试方法：</h4>
        <ul>
          <li>镀层重量测定：重量法</li>
          <li>涂层厚度测量：磁感应法</li>
          <li>均匀性测试：硫酸铜浸泡试验</li>
        </ul>`
    },
    3: {
      scope: 'GB/T 17116标准规定了钢铁制件热浸镀锌层的技术要求和试验方法，适用于各种钢铁制品。',
      requirements: `<h4>主要技术要求：</h4>
        <ul>
          <li>镀层厚度：根据产品类别和应用环境划分为不同等级</li>
          <li>表面质量：不应有裸露、气泡、粗糙等缺陷</li>
          <li>附着力：镀层应牢固附着在基体表面</li>
        </ul>`,
      testMethods: `<h4>测试方法：</h4>
        <ul>
          <li>镀层厚度测量：磁性法、金相法</li>
          <li>附着力测试：敲击试验、弯曲试验</li>
          <li>外观检验：目视检查</li>
        </ul>`
    },
    4: {
      scope: 'EN 10346标准适用于通过连续热浸镀工艺生产的钢板和钢带产品，涵盖了锌、锌铁合金、锌铝合金等多种涂层类型。',
      requirements: `<h4>主要技术要求：</h4>
        <ul>
          <li>涂层类型：Z(纯锌)、ZF(锌铁)、ZA(锌铝)等</li>
          <li>涂层重量：按不同标号划分涂层质量等级</li>
          <li>表面质量：表面应平整、连续，允许有的小缺陷范围</li>
        </ul>`,
      testMethods: `<h4>测试方法：</h4>
        <ul>
          <li>涂层重量测定：化学法、称重法</li>
          <li>涂层附着力：弯曲试验</li>
          <li>涂层均匀性：目视检查</li>
        </ul>`
    },
    5: {
      scope: 'JIS H 8641标准规定了钢铁材料热浸镀锌的技术要求和试验方法，包括涂层厚度、外观和性能等要求。',
      requirements: `<h4>主要技术要求：</h4>
        <ul>
          <li>镀层等级：分为HDZ35、HDZ40、HDZ45、HDZ55等级别</li>
          <li>外观质量：镀层应连续、均匀</li>
          <li>附着力要求：镀层与基体应牢固结合</li>
        </ul>`,
      testMethods: `<h4>测试方法：</h4>
        <ul>
          <li>涂层重量测定：称重法</li>
          <li>涂层厚度测量：磁性测厚法</li>
          <li>附着力测试：敲击试验</li>
        </ul>`
    }
  }
  
  if (detailsMap[id]) {
    standardDetails.value = detailsMap[id]
  } else {
    standardDetails.value = {
      scope: '暂无范围信息',
      requirements: '<p>暂无技术要求信息</p>',
      testMethods: '<p>暂无测试方法信息</p>'
    }
  }
  
  // 加载相关标准（排除当前查看的标准）
  relatedStandards.value = store.getters.standards
    .filter(s => s.id !== parseInt(id))
    .slice(0, 3) // 只显示3个相关标准
}

// 查看其他标准
const viewStandard = (id) => {
  router.push(`/standards-database/${id}`)
}

// 下载标准
const downloadStandard = () => {
  ElMessage({
    message: '标准文件开始下载',
    type: 'success'
  })
  // 实际应用中这里应该调用下载API
  console.log('下载标准:', standard.value.code)
}

onMounted(async () => {
  const standardId = route.params.id
  if (!standardId) {
    router.push('/standards-database')
    return
  }
  
  // 从store获取标准详情
  const standardData = store.getters.standards.find(s => s.id === parseInt(standardId))
  
  if (standardData) {
    standard.value = standardData
    loadStandardDetails(standardId)
  } else {
    // 如果store中没有，尝试从API获取
    try {
      await store.dispatch('fetchStandardDetail', standardId)
      standard.value = store.getters.currentStandard
      loadStandardDetails(standardId)
    } catch (error) {
      console.error('获取标准详情失败:', error)
      ElMessage.error('获取标准详情失败')
      router.push('/standards-database')
    }
  }
})
</script>

<style scoped>
.standard-detail {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.standard-info {
  margin-bottom: 30px;
  text-align: center;
}

.standard-code {
  font-size: 1.2rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 10px;
}

.standard-name {
  font-size: 2rem;
  margin-bottom: 20px;
}

.standard-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.detail-card {
  margin-bottom: 30px;
}

.card-header {
  font-size: 1.2rem;
  font-weight: 500;
}

.card-content {
  line-height: 1.6;
}

.detail-tabs {
  margin-bottom: 40px;
}

.tab-content {
  padding: 20px 0;
}

.tab-content h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.tab-content p {
  line-height: 1.6;
  color: #333;
}

.related-standards {
  margin-bottom: 40px;
}

.related-standards h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.download-section {
  text-align: center;
  margin: 40px 0;
}

.loading-state {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}
</style> 