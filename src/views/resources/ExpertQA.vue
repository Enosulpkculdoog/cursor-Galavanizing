/* eslint-disable */
<template>
  <div class="expert-qa">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('resources.expertQa.title') }}</h1>
        <p>{{ $t('resources.expertQa.description') }}</p>
        <el-button type="primary" size="large" class="ask-button" @click="showAskForm">
          <el-icon><QuestionFilled /></el-icon>
          {{ $t('resources.expertQa.askQuestion') }}
        </el-button>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('resources.expertQa.searchPlaceholder')"
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
            :placeholder="$t('resources.expertQa.categoryPlaceholder')"
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
          
          <el-radio-group v-model="filter" size="small">
            <el-radio-button label="all">{{ $t('resources.expertQa.allQuestions') }}</el-radio-button>
            <el-radio-button label="popular">{{ $t('resources.expertQa.popular') }}</el-radio-button>
            <el-radio-button label="unanswered">{{ $t('resources.expertQa.unanswered') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 问答列表 -->
      <div class="qa-list">
        <el-card 
          v-for="question in filteredQuestions" 
          :key="question.id"
          class="qa-card"
          shadow="hover"
        >
          <div class="qa-stats">
            <div class="stat-item">
              <span class="stat-number">{{ question.answers }}</span>
              <span class="stat-label">{{ $t('resources.expertQa.answers') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ question.views }}</span>
              <span class="stat-label">{{ $t('resources.expertQa.views') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ question.votes }}</span>
              <span class="stat-label">{{ $t('resources.expertQa.votes') }}</span>
            </div>
          </div>
          
          <div class="qa-content">
            <h3 class="qa-title" @click="viewQuestion(question.id)">
              {{ question.title }}
            </h3>
            
            <div class="qa-tags">
              <el-tag 
                v-for="tag in question.tags" 
                :key="tag"
                size="small"
                class="qa-tag"
              >
                {{ tag }}
              </el-tag>
              
              <el-tag 
                v-if="question.isAnswered" 
                type="success" 
                size="small"
                class="qa-status"
              >
                {{ $t('resources.expertQa.answered') }}
              </el-tag>
              
              <el-tag 
                v-else 
                type="warning" 
                size="small"
                class="qa-status"
              >
                {{ $t('resources.expertQa.needsAnswer') }}
              </el-tag>
            </div>
            
            <p class="qa-excerpt">{{ question.excerpt }}</p>
            
            <div class="qa-meta">
              <div class="qa-author">
                <el-avatar :size="24" :src="question.author.avatar" />
                <span>{{ question.author.name }}</span>
                <el-tag v-if="question.author.isExpert" size="small" type="primary">{{ $t('resources.expertQa.expert') }}</el-tag>
              </div>
              <div class="qa-time">
                {{ $t('resources.expertQa.asked') }} {{ question.createdAt }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalQuestions"
          :page-size="10"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- 提问表单对话框 -->
    <el-dialog
      v-model="askDialogVisible"
      :title="$t('resources.expertQa.askNewQuestion')"
      width="60%"
      destroy-on-close
    >
      <el-form :model="questionForm" label-position="top" :rules="rules" ref="questionFormRef">
        <el-form-item :label="$t('resources.expertQa.questionTitle')" prop="title">
          <el-input v-model="questionForm.title" :placeholder="$t('resources.expertQa.titlePlaceholder')" />
        </el-form-item>
        
        <el-form-item :label="$t('resources.expertQa.category')" prop="category">
          <el-select 
            v-model="questionForm.category" 
            :placeholder="$t('resources.expertQa.selectCategory')"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('resources.expertQa.tags')" prop="tags">
          <el-select
            v-model="questionForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            :placeholder="$t('resources.expertQa.tagsPlaceholder')"
            style="width: 100%"
          >
            <el-option
              v-for="tag in commonTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('resources.expertQa.details')" prop="content">
          <el-input
            v-model="questionForm.content"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12 }"
            :placeholder="$t('resources.expertQa.detailsPlaceholder')"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="askDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitQuestion">{{ $t('resources.expertQa.postQuestion') }}</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('')
const filter = ref('all')

// 提问对话框
const askDialogVisible = ref(false)
const questionFormRef = ref(null)
const questionForm = ref({
  title: '',
  category: '',
  tags: [],
  content: ''
})

// 表单校验规则
const rules = {
  title: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 10, max: 100, message: '标题长度应在10到100个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择问题类别', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入问题详情', trigger: 'blur' },
    { min: 20, message: '问题详情至少20个字符', trigger: 'blur' }
  ],
  tags: [
    { required: true, message: '请至少选择一个标签', trigger: 'change' },
    { type: 'array', max: 5, message: '最多选择5个标签', trigger: 'change' }
  ]
}

// 问题分类
const categories = [
  { value: 'process', label: '生产工艺' },
  { value: 'equipment', label: '设备问题' },
  { value: 'quality', label: '质量控制' },
  { value: 'materials', label: '材料选择' },
  { value: 'testing', label: '检测方法' },
  { value: 'maintenance', label: '设备维护' }
]

// 常用标签
const commonTags = [
  '热镀锌', '电镀锌', '酸洗', '钝化', '镀层厚度', '附着力', '锌锅', '助镀剂',
  '表面缺陷', '白锈', '黑点', '气泡', '腐蚀测试', '成本控制', '环保技术'
]

// 问答数据
const questions = ref([
  {
    id: 1,
    title: '热镀锌钢丝镀层不均匀的原因和解决方法？',
    excerpt: '我们在生产过程中遇到了镀层厚度波动较大的问题，部分产品镀层厚度偏低，而另一部分则偏高，导致产品质量不稳定。已经检查了锌液温度和钢丝通过速度，但问题仍然存在...',
    createdAt: '2023-12-10',
    author: {
      name: '张工',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isExpert: false
    },
    tags: ['热镀锌', '镀层厚度', '质量问题'],
    category: 'process',
    isAnswered: true,
    answers: 3,
    views: 215,
    votes: 8
  },
  {
    id: 2,
    title: '钢丝镀锌前酸洗后黑点问题如何解决？',
    excerpt: '钢丝在酸洗后出现大量黑点，这些黑点在热镀锌后仍然可见，影响产品外观和质量。我们使用的是10%浓度的盐酸，温度约50℃。试过延长酸洗时间，但效果不明显...',
    createdAt: '2023-12-05',
    author: {
      name: '李经理',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      isExpert: false
    },
    tags: ['酸洗', '黑点', '表面缺陷'],
    category: 'quality',
    isAnswered: true,
    answers: 2,
    views: 187,
    votes: 5
  },
  {
    id: 3,
    title: '连续镀锌线锌锅液面波动大的原因分析',
    excerpt: '我们的连续镀锌线运行时锌锅液面波动较大，导致钢丝进出口处镀锌厚度不稳定。设备运行约3年，之前没有出现过类似问题。近期检查发现锌锅加热系统温度波动约±5℃...',
    createdAt: '2023-11-28',
    author: {
      name: '王设备',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isExpert: false
    },
    tags: ['锌锅', '设备问题', '温度控制'],
    category: 'equipment',
    isAnswered: false,
    answers: 0,
    views: 142,
    votes: 4
  },
  {
    id: 4,
    title: '不同钢丝基材对热镀锌层附着力的影响',
    excerpt: '我们在使用不同供应商的钢丝进行热镀锌时，发现最终产品的镀层附着力有明显差异。特别是高碳钢丝比低碳钢丝的镀层附着力更差，经常在弯曲测试中出现剥离...',
    createdAt: '2023-11-25',
    author: {
      name: '刘工程师',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      isExpert: true
    },
    tags: ['附着力', '钢丝基材', '热镀锌'],
    category: 'materials',
    isAnswered: true,
    answers: 5,
    views: 230,
    votes: 12
  },
  {
    id: 5,
    title: '镀锌钢丝表面白锈形成原因及防控措施',
    excerpt: '我们的镀锌钢丝产品在仓储一周后开始出现白锈，特别是在高湿度环境下更为严重。目前采用了钝化处理，但效果不够理想。想了解有哪些更有效的防白锈方法...',
    createdAt: '2023-11-20',
    author: {
      name: '赵质检',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      isExpert: false
    },
    tags: ['白锈', '钝化', '防腐'],
    category: 'quality',
    isAnswered: true,
    answers: 4,
    views: 198,
    votes: 7
  },
  {
    id: 6,
    title: '环保型助镀剂的选择和使用方法',
    excerpt: '因环保要求提高，我们需要替换当前使用的含铵盐助镀剂。有哪些环保型助镀剂推荐？这些新型助镀剂的使用条件和效果如何？是否需要对原有工艺流程进行调整？',
    createdAt: '2023-11-15',
    author: {
      name: '孙环保',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      isExpert: false
    },
    tags: ['助镀剂', '环保技术', '工艺调整'],
    category: 'process',
    isAnswered: false,
    answers: 1,
    views: 165,
    votes: 6
  },
  {
    id: 7,
    title: '镀锌层厚度测量仪器精度比对分析',
    excerpt: '我们车间使用的是磁性测厚仪，但与客户使用的X射线荧光测厚仪结果有约5%的差异，导致产品验收争议。想了解不同测厚方法的精度差异及校准方法...',
    createdAt: '2023-11-10',
    author: {
      name: '陈质量',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      isExpert: true
    },
    tags: ['测厚仪', '检测方法', '质量控制'],
    category: 'testing',
    isAnswered: true,
    answers: 3,
    views: 210,
    votes: 9
  }
])

// 根据筛选条件过滤问题
const filteredQuestions = computed(() => {
  return questions.value.filter(question => {
    // 搜索关键词匹配
    const matchesQuery = searchQuery.value === '' || 
      question.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      question.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 分类匹配
    const matchesCategory = selectedCategory.value === '' || 
      question.category === selectedCategory.value
    
    // 筛选条件匹配
    let matchesFilter = true
    if (filter.value === 'popular') {
      matchesFilter = question.views > 200 || question.votes > 5
    } else if (filter.value === 'unanswered') {
      matchesFilter = !question.isAnswered
    }
    
    return matchesQuery && matchesCategory && matchesFilter
  })
})

// 问题总数
const totalQuestions = computed(() => filteredQuestions.value.length)

// 显示提问表单
const showAskForm = () => {
  askDialogVisible.value = true
}

// 提交问题
const submitQuestion = async () => {
  if (!questionFormRef.value) return
  
  await questionFormRef.value.validate(async (valid) => {
    if (valid) {
      // 这里应该发送API请求保存问题
      console.log('提交问题', questionForm.value)
      
      ElMessage({
        message: '您的问题已提交，专家会尽快回答',
        type: 'success'
      })
      
      askDialogVisible.value = false
      
      // 重置表单
      questionForm.value = {
        title: '',
        category: '',
        tags: [],
        content: ''
      }
    }
  })
}

// 查看问题详情
const viewQuestion = (questionId) => {
  router.push(`/resources/expert-qa/${questionId}`)
}

// 处理页码变化
const handlePageChange = (page) => {
  console.log('当前页:', page)
  // 这里可以调用API获取对应页码的数据
}

onMounted(() => {
  // 可以在这里请求API获取问题列表
})
</script>

<style scoped>
.expert-qa {
  min-height: 100vh;
  background-color: var(--background-color);
}

.page-header {
  background: linear-gradient(135deg, #673ab7, #9c27b0);
  color: white;
  padding: 50px 20px;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2.4rem;
  margin-bottom: 15px;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto 30px;
}

.ask-button {
  font-size: 1.1rem;
  padding: 12px 25px;
}

.ask-button .el-icon {
  margin-right: 8px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

/* 搜索区域样式 */
.search-section {
  background-color: white;
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

/* 问答卡片样式 */
.qa-card {
  display: flex;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.qa-stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  min-width: 80px;
  border-right: 1px solid #eaeaea;
}

.stat-item {
  text-align: center;
  margin: 5px 0;
}

.stat-number {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #909399;
}

.qa-content {
  padding: 20px;
  flex-grow: 1;
}

.qa-title {
  font-size: 1.3rem;
  margin: 0 0 15px;
  color: var(--primary-color);
  cursor: pointer;
}

.qa-title:hover {
  text-decoration: underline;
}

.qa-tags {
  margin-bottom: 15px;
}

.qa-tag, .qa-status {
  margin-right: 8px;
  margin-bottom: 8px;
}

.qa-excerpt {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 15px;
}

.qa-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #909399;
}

.qa-author {
  display: flex;
  align-items: center;
}

.qa-author .el-avatar {
  margin-right: 8px;
}

.qa-author .el-tag {
  margin-left: 8px;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .qa-card {
    flex-direction: column;
  }
  
  .qa-stats {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
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