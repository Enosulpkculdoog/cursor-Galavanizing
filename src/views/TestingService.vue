<template>
  <div class="testing-service">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ $t('testing.title') }}</h1>
      <p>{{ $t('testing.subtitle') }}</p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧服务导航 -->
      <div class="service-sidebar">
        <el-menu
          :default-active="activeService"
          class="service-menu"
          @select="handleServiceSelect"
        >
          <el-menu-item index="appointment">
            <el-icon><Calendar /></el-icon>
            <span>{{ $t('testing.services.appointment') }}</span>
          </el-menu-item>
          <el-menu-item index="report">
            <el-icon><Document /></el-icon>
            <span>{{ $t('testing.services.report') }}</span>
          </el-menu-item>
          <el-menu-item index="progress">
            <el-icon><Timer /></el-icon>
            <span>{{ $t('testing.services.progress') }}</span>
          </el-menu-item>
          <el-menu-item index="standard">
            <el-icon><Collection /></el-icon>
            <span>{{ $t('testing.services.standard') }}</span>
          </el-menu-item>
        </el-menu>
        
        <!-- 最近检测记录 -->
        <div class="recent-tests" v-if="recentTests.length > 0">
          <h3>最近检测</h3>
          <el-scrollbar height="300px">
            <div 
              v-for="test in recentTests" 
              :key="test.id" 
              class="test-item"
              @click="viewTestDetail(test.id)"
            >
              <div class="test-info">
                <div class="test-title">{{ test.productName }}</div>
                <div class="test-date">{{ formatDate(test.date) }}</div>
              </div>
              <el-tag :type="getStatusType(test.status)">
                {{ getStatusText(test.status) }}
              </el-tag>
            </div>
          </el-scrollbar>
        </div>
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="service-content">
        <!-- 检测预约表单 -->
        <div v-show="activeService === 'appointment'" class="service-section">
          <h2>{{ $t('testing.appointment.title') }}</h2>
          <el-form 
            ref="appointmentForm"
            :model="appointmentForm"
            :rules="appointmentRules"
            label-width="120px"
          >
            <el-form-item :label="$t('testing.appointment.productName')" prop="productName">
              <el-input v-model="appointmentForm.productName" :placeholder="$t('testing.appointment.productName')" />
            </el-form-item>
            
            <el-form-item :label="$t('testing.appointment.specification')" prop="specification">
              <el-input v-model="appointmentForm.specification" :placeholder="$t('testing.appointment.specification')" />
            </el-form-item>
            
            <el-form-item :label="$t('testing.appointment.testItems')" prop="testItems">
              <el-checkbox-group v-model="appointmentForm.testItems">
                <el-checkbox label="thickness">镀层厚度</el-checkbox>
                <el-checkbox label="adhesion">附着力</el-checkbox>
                <el-checkbox label="corrosion">耐腐蚀性</el-checkbox>
                <el-checkbox label="uniformity">均匀性</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item :label="$t('testing.appointment.standard')" prop="standard">
              <el-select v-model="appointmentForm.standard" :placeholder="$t('testing.appointment.standard')">
                <el-option label="ISO 1461" value="ISO1461" />
                <el-option label="ASTM A123" value="ASTMA123" />
                <el-option label="GB/T 13912" value="GB13912" />
              </el-select>
            </el-form-item>
            
            <el-form-item :label="$t('testing.appointment.date')" prop="appointmentDate">
              <el-date-picker
                v-model="appointmentForm.appointmentDate"
                type="date"
                :placeholder="$t('testing.appointment.date')"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            
            <el-form-item :label="$t('testing.appointment.remarks')" prop="remarks">
              <el-input
                v-model="appointmentForm.remarks"
                type="textarea"
                rows="3"
                :placeholder="$t('testing.appointment.remarks')"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitAppointment">{{ $t('testing.appointment.submit') }}</el-button>
              <el-button @click="resetAppointment">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 报告查询 -->
        <div v-show="activeService === 'report'" class="service-section">
          <h2>{{ $t('testing.report.title') }}</h2>
          <div class="report-search">
            <el-form :inline="true" :model="reportSearchForm">
              <el-form-item :label="$t('testing.report.reportNo')">
                <el-input v-model="reportSearchForm.reportNo" :placeholder="$t('testing.report.reportNo')" />
              </el-form-item>
              <el-form-item :label="$t('testing.report.testDate')">
                <el-date-picker
                  v-model="reportSearchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchReports">{{ $t('common.search') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="report-list">
            <el-table :data="reportList" style="width: 100%">
              <el-table-column prop="reportNo" :label="$t('testing.report.reportNo')" width="180" />
              <el-table-column prop="productName" :label="$t('testing.appointment.productName')" />
              <el-table-column prop="testDate" :label="$t('testing.report.testDate')" width="180" />
              <el-table-column prop="status" :label="$t('testing.report.status')" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('standards.table.operation')" width="150">
                <template #default="scope">
                  <el-button 
                    type="primary" 
                    link
                    @click="viewReport(scope.row.id)"
                  >
                    {{ $t('common.view') }}
                  </el-button>
                  <el-button 
                    type="primary" 
                    link
                    @click="downloadReport(scope.row.id)"
                  >
                    {{ $t('common.download') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="totalReports"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
        
        <!-- 进度跟踪 -->
        <div v-show="activeService === 'progress'" class="service-section">
          <h2>{{ $t('testing.progress.title') }}</h2>
          <div class="progress-search">
            <el-form :inline="true" :model="progressSearchForm">
              <el-form-item :label="$t('testing.progress.orderNo')">
                <el-input v-model="progressSearchForm.orderNo" :placeholder="$t('testing.progress.orderNo')" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchProgress">{{ $t('common.search') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div v-if="currentOrder" class="progress-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in currentOrder.activities"
                :key="index"
                :timestamp="activity.time"
                :type="getTimelineItemType(activity.status)"
              >
                <el-card>
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          
          <div v-else class="no-progress">
            <el-empty description="暂无进度信息" />
          </div>
        </div>
        
        <!-- 检测标准 -->
        <div v-show="activeService === 'standard'" class="service-section">
          <h2>{{ $t('testing.services.standard') }}</h2>
          <div class="standard-list">
            <el-table :data="standardList" style="width: 100%">
              <el-table-column prop="code" :label="$t('standards.table.code')" width="180" />
              <el-table-column prop="name" :label="$t('standards.table.name')" />
              <el-table-column prop="scope" :label="$t('standards.detail.scope')" />
              <el-table-column prop="updateDate" :label="$t('standards.table.publishDate')" width="180" />
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
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Calendar, Document, Timer, Collection
} from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 当前激活的服务
const activeService = ref('appointment')

// 处理服务选择
const handleServiceSelect = (index) => {
  activeService.value = index
}

// 预约表单数据
const appointmentForm = ref({
  productName: '',
  specification: '',
  testItems: [],
  standard: '',
  appointmentDate: '',
  remarks: ''
})

// 预约表单验证规则
const appointmentRules = {
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  specification: [
    { required: true, message: '请输入产品规格', trigger: 'blur' }
  ],
  testItems: [
    { type: 'array', required: true, message: '请选择检测项目', trigger: 'change' }
  ],
  standard: [
    { required: true, message: '请选择检测标准', trigger: 'change' }
  ],
  appointmentDate: [
    { required: true, message: '请选择预约日期', trigger: 'change' }
  ]
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 提交预约
const submitAppointment = async () => {
  try {
    // 这里添加实际的提交逻辑
    ElMessage.success('预约提交成功')
    resetAppointment()
  } catch (error) {
    ElMessage.error('预约提交失败')
  }
}

// 重置预约表单
const resetAppointment = () => {
  appointmentForm.value = {
    productName: '',
    specification: '',
    testItems: [],
    standard: '',
    appointmentDate: '',
    remarks: ''
  }
}

// 报告查询表单
const reportSearchForm = ref({
  reportNo: '',
  dateRange: []
})

// 报告列表数据
const reportList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalReports = ref(0)

// 搜索报告
const searchReports = () => {
  // 这里添加实际的搜索逻辑
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  searchReports()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  searchReports()
}

// 进度跟踪表单
const progressSearchForm = ref({
  orderNo: ''
})

// 当前订单进度
const currentOrder = ref(null)

// 搜索进度
const searchProgress = () => {
  // 这里添加实际的进度查询逻辑
}

// 检测标准列表
const standardList = ref([
  {
    id: 1,
    code: 'ISO 1461',
    name: '钢铁制品热镀锌层技术要求',
    scope: '适用于钢铁制品的热镀锌层',
    updateDate: '2023-01-01'
  },
  {
    id: 2,
    code: 'ASTM A123',
    name: '钢铁制品热镀锌层标准规范',
    scope: '适用于钢铁制品的热镀锌层',
    updateDate: '2023-02-15'
  },
  {
    id: 3,
    code: 'GB/T 13912',
    name: '金属覆盖层 钢铁制品热镀锌层技术要求',
    scope: '适用于钢铁制品的热镀锌层',
    updateDate: '2023-03-20'
  }
])

// 最近检测记录
const recentTests = ref([
  {
    id: 1,
    productName: '钢丝绳',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 2,
    productName: '钢绞线',
    date: '2024-03-14',
    status: 'processing'
  },
  {
    id: 3,
    productName: '钢丝网',
    date: '2024-03-13',
    status: 'pending'
  }
])

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    completed: 'success',
    processing: 'warning',
    pending: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    processing: '进行中',
    pending: '待处理'
  }
  return statusMap[status] || '未知'
}

// 获取时间线项目类型
const getTimelineItemType = (status) => {
  const typeMap = {
    completed: 'success',
    processing: 'warning',
    pending: 'info'
  }
  return typeMap[status] || 'info'
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// 查看报告详情
const viewReport = (id) => {
  // 实现查看报告详情逻辑
}

// 下载报告
const downloadReport = (id) => {
  // 实现下载报告逻辑
}

// 查看标准详情
const viewStandard = (id) => {
  // 实现查看标准详情逻辑
}

// 查看检测详情
const viewTestDetail = (id) => {
  // 实现查看检测详情逻辑
}

// 页面挂载时加载数据
onMounted(() => {
  // 加载初始数据
  searchReports()
})
</script>

<style scoped>
.testing-service {
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
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

/* 侧边栏样式 */
.service-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.service-menu {
  border-right: none;
  background-color: transparent;
}

.service-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  border-radius: 8px;
}

.service-menu .el-menu-item.is-active {
  background-color: var(--primary-color);
  color: white;
}

.service-menu .el-menu-item .el-icon {
  margin-right: 10px;
}

/* 内容区域样式 */
.service-content {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.service-section {
  display: none;
}

.service-section:first-child {
  display: block;
}

.service-section h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 1.8rem;
}

/* 预约表单样式 */
.el-form {
  max-width: 600px;
  margin: 0 auto;
}

/* 报告查询样式 */
.report-search {
  margin-bottom: 20px;
}

.report-list {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 进度跟踪样式 */
.progress-search {
  margin-bottom: 20px;
}

.progress-timeline {
  margin-top: 20px;
}

.no-progress {
  margin-top: 40px;
  text-align: center;
}

/* 最近检测记录样式 */
.recent-tests {
  margin-top: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recent-tests h3 {
  margin: 0 0 15px 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.test-item:hover {
  background: #e6f1f9;
}

.test-info {
  flex: 1;
  overflow: hidden;
}

.test-title {
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 3px;
}

.test-date {
  font-size: 0.8rem;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .service-sidebar {
    width: 100%;
  }
  
  .service-menu {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .service-menu .el-menu-item {
    flex-shrink: 0;
    margin-right: 10px;
  }
  
  .recent-tests {
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .el-form {
    max-width: 100%;
  }
  
  .report-search .el-form-item {
    margin-bottom: 10px;
  }
}
</style> 