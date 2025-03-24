<template>
  <div class="question-detail">
    <!-- 顶部导航 -->
    <NavHeader />
    
    <!-- 页面主体 -->
    <div class="page-container">
      <div class="main-content">
        <!-- 返回链接 -->
        <div class="back-link">
          <el-button type="text" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            {{ $t('resources.expertQA.backToList') }}
          </el-button>
        </div>
        
        <!-- 问题详情卡片 -->
        <el-card class="question-card" v-loading="loading">
          <div class="question-header">
            <h2 class="question-title">{{ question.title }}</h2>
            <div class="question-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(question.createdAt) }}
              </div>
              <div class="meta-item">
                <el-icon><View /></el-icon>
                {{ question.views }} {{ $t('resources.expertQA.views') }}
              </div>
              <div class="meta-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ question.answerCount }} {{ $t('resources.expertQA.answers') }}
              </div>
            </div>
            <div class="question-tags">
              <el-tag v-for="tag in question.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
            </div>
          </div>
          
          <div class="question-content">
            <div class="question-asker">
              <div class="asker-avatar">
                <el-avatar :size="40" :src="question.asker.avatar">
                  {{ question.asker.name.charAt(0) }}
                </el-avatar>
              </div>
              <div class="asker-info">
                <div class="asker-name">{{ question.asker.name }}</div>
                <div class="asker-role">{{ question.asker.role }}</div>
              </div>
            </div>
            
            <div class="question-text" v-html="question.content"></div>
            
            <div class="question-attachments" v-if="question.attachments && question.attachments.length > 0">
              <h4>{{ $t('resources.expertQA.attachments') }}</h4>
              <div class="attachment-list">
                <div v-for="(attachment, index) in question.attachments" :key="index" class="attachment-item">
                  <el-button type="primary" text @click="downloadAttachment(attachment)">
                    <el-icon><Document /></el-icon>
                    {{ attachment.name }}
                  </el-button>
                  <span class="file-size">{{ formatFileSize(attachment.size) }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        
        <!-- 专家答案 -->
        <div class="answers-section" v-if="!loading">
          <h3 class="section-title">{{ $t('resources.expertQA.expertAnswers') }}</h3>
          
          <template v-if="question.answers && question.answers.length > 0">
            <el-card v-for="(answer, index) in question.answers" :key="index" class="answer-card">
              <div class="answer-header">
                <div class="expert-info">
                  <el-avatar :size="50" :src="answer.expert.avatar">
                    {{ answer.expert.name.charAt(0) }}
                  </el-avatar>
                  <div class="expert-details">
                    <div class="expert-name">{{ answer.expert.name }}</div>
                    <div class="expert-title">{{ answer.expert.title }}</div>
                    <div class="expert-org">{{ answer.expert.organization }}</div>
                  </div>
                </div>
                <div class="answer-meta">
                  <div class="answer-date">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(answer.createdAt) }}
                  </div>
                </div>
              </div>
              
              <div class="answer-content" v-html="answer.content"></div>
              
              <div class="answer-footer">
                <div class="answer-useful">
                  <el-button type="text" @click="markUseful(answer.id)" :disabled="answer.markedUseful">
                    <el-icon><ThumbUp /></el-icon>
                    {{ answer.markedUseful ? $t('resources.expertQA.markedUseful') : $t('resources.expertQA.markAsUseful') }}
                    <span v-if="answer.usefulCount > 0">({{ answer.usefulCount }})</span>
                  </el-button>
                </div>
              </div>
            </el-card>
          </template>
          
          <el-empty v-else description="暂无专家回答" />
        </div>
        
        <!-- 相关问题 -->
        <div class="related-questions" v-if="!loading && relatedQuestions.length > 0">
          <h3 class="section-title">{{ $t('resources.expertQA.relatedQuestions') }}</h3>
          
          <el-card class="related-card">
            <ul class="related-list">
              <li v-for="related in relatedQuestions" :key="related.id" class="related-item">
                <router-link :to="`/resources/expert-qa/${related.id}`">
                  {{ related.title }}
                </router-link>
                <div class="related-meta">
                  <span class="related-date">{{ formatDate(related.createdAt) }}</span>
                  <span class="related-answers">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ related.answerCount }}
                  </span>
                </div>
              </li>
            </ul>
          </el-card>
        </div>
        
        <!-- 提交新问题 -->
        <div class="ask-question-section" v-if="!loading">
          <el-card class="ask-card">
            <template #header>
              <div class="ask-header">
                <h3>{{ $t('resources.expertQA.askNewQuestion') }}</h3>
              </div>
            </template>
            <div class="ask-content">
              <p>{{ $t('resources.expertQA.didntFindAnswer') }}</p>
              <el-button type="primary" @click="goToAskQuestion">
                {{ $t('resources.expertQA.askQuestion') }}
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Calendar, 
  View, 
  ChatDotRound, 
  Document, 
  ThumbUp 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import NavHeader from '@/components/NavHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

// 获取问题ID
const questionId = computed(() => route.params.id)

// 问题详情
const question = ref({
  id: '',
  title: '',
  content: '',
  createdAt: '',
  views: 0,
  answerCount: 0,
  tags: [],
  asker: {
    name: '',
    avatar: '',
    role: ''
  },
  attachments: [],
  answers: []
})

// 相关问题
const relatedQuestions = ref([])

// 返回上一页
const goBack = () => {
  router.push('/resources/expert-qa')
}

// 跳转到提问页面
const goToAskQuestion = () => {
  router.push('/resources/expert-qa/ask')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// 下载附件
const downloadAttachment = (attachment) => {
  console.log('下载附件', attachment)
  ElMessage.success('开始下载：' + attachment.name)
  // 实际下载逻辑
}

// 标记答案有用
const markUseful = (answerId) => {
  console.log('标记答案有用', answerId)
  // 找到对应的答案并更新
  const answer = question.value.answers.find(a => a.id === answerId)
  if (answer) {
    answer.markedUseful = true
    answer.usefulCount++
    ElMessage.success('感谢您的反馈')
  }
}

// 获取问题详情
const fetchQuestionDetail = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    question.value = {
      id: questionId.value,
      title: '镀锌钢丝在海洋环境中的耐腐蚀性能如何提升？',
      content: `<p>我们公司正在研发用于海洋环境中的镀锌钢丝产品。目前遇到的主要问题是在高盐雾环境下，产品的耐腐蚀性能不足，使用寿命未达到预期。</p>
      <p>我们已经尝试了增加镀锌层厚度（从原来的60g/m²增加到90g/m²），但效果提升有限。想请教专家们：</p>
      <ol>
        <li>在海洋环境下，有哪些特殊的工艺可以提高镀锌钢丝的耐腐蚀性能？</li>
        <li>是否推荐在镀锌层上增加其他防腐处理？例如有机涂层？</li>
        <li>国际上对海洋环境使用的镀锌钢丝有哪些先进处理方法和标准？</li>
      </ol>
      <p>感谢专家们的指导！</p>`,
      createdAt: '2023-05-10T08:30:00Z',
      views: 215,
      answerCount: 2,
      tags: ['海洋环境', '耐腐蚀', '镀锌工艺', '产品开发'],
      asker: {
        name: '张工',
        avatar: '',
        role: '研发工程师'
      },
      attachments: [
        {
          name: '产品测试数据.xlsx',
          size: 2456000,
          url: '#'
        },
        {
          name: '盐雾测试报告.pdf',
          size: 3570000,
          url: '#'
        }
      ],
      answers: [
        {
          id: 'ans1',
          expert: {
            name: '李教授',
            avatar: '',
            title: '材料科学教授',
            organization: '中国海洋大学'
          },
          content: `<p>针对海洋环境中镀锌钢丝的耐腐蚀性问题，我有以下几点建议：</p>
          <h4>1. 合金化处理</h4>
          <p>建议采用镀锌-5%铝合金（Zn-5%Al）或锌-铝-镁合金（Zn-Al-Mg）涂层。这类合金化涂层的耐蚀性能比普通热镀锌高2-3倍。锌铝镁合金涂层在海洋环境中表现尤为突出。</p>
          <h4>2. 表面钝化处理</h4>
          <p>在镀锌后进行铬酸盐钝化或无铬钝化处理，可以形成一层保护膜，有效阻止氯离子的侵蚀。考虑到环保因素，推荐采用硅酸盐或钼酸盐等无铬钝化工艺。</p>
          <h4>3. 有机涂层复合保护</h4>
          <p>在镀锌层上再涂覆环氧树脂或聚氨酯涂层，形成复合保护系统，这在海洋环境中是非常有效的方法。涂层厚度建议控制在80-120μm。</p>
          <h4>4. 关于标准</h4>
          <p>建议参考ISO 9227和ASTM B117标准进行盐雾测试，为海洋环境使用的产品，建议达到1000小时以上的盐雾测试要求。美国船级社(ABS)和挪威船级社(DNV)都有针对海洋环境中金属材料的详细规范。</p>
          <p>此外，建议优化镀锌工艺参数，保证镀层均匀性和结合力，这对耐蚀性也有显著影响。</p>`,
          createdAt: '2023-05-11T15:20:00Z',
          usefulCount: 12,
          markedUseful: false
        },
        {
          id: 'ans2',
          expert: {
            name: '王总工',
            avatar: '',
            title: '首席工艺专家',
            organization: '国家金属腐蚀控制中心'
          },
          content: `<p>补充几点实际应用中的经验：</p>
          <ol>
            <li>
              <strong>预处理至关重要</strong>：确保钢丝表面完全清洁，无油脂和氧化物。建议使用超声波清洗并配合适当的酸洗工艺，这可以显著提高镀层附着力。
            </li>
            <li>
              <strong>控制镀锌温度和时间</strong>：建议将热镀锌温度控制在445-455℃之间，并根据钢丝直径调整浸渍时间，这有助于形成致密的η-ζ相结构，提高耐蚀性。
            </li>
            <li>
              <strong>锌-镍合金电镀</strong>：对于高要求场景，可考虑采用锌-12%镍合金电镀，其耐蚀性能是普通热镀锌的5-6倍，特别适合海洋环境。
            </li>
            <li>
              <strong>定期检测与维护</strong>：建议在产品说明中增加定期检查和维护建议，如每半年检查一次，并用适当的防腐蚀涂料修补损伤处。
            </li>
          </ol>
          <p>我们中心曾为多家企业提供过海洋环境中金属防腐技术咨询，如需进一步讨论具体方案，可以联系我们进行产品测试和工艺优化。</p>`,
          createdAt: '2023-05-12T09:45:00Z',
          usefulCount: 8,
          markedUseful: false
        }
      ]
    }
    
    // 模拟相关问题
    relatedQuestions.value = [
      {
        id: 'q2',
        title: '热镀锌与电镀锌在耐腐蚀性能上的差异',
        createdAt: '2023-04-15T10:20:00Z',
        answerCount: 3
      },
      {
        id: 'q3',
        title: '镀锌钢丝用于沿海地区电力设施的防腐蚀方案',
        createdAt: '2023-03-22T14:50:00Z',
        answerCount: 2
      },
      {
        id: 'q4',
        title: '锌铝镁合金涂层的最新应用与发展趋势',
        createdAt: '2023-06-01T11:35:00Z',
        answerCount: 1
      }
    ]
    
    // 模拟更新浏览量
    console.log('更新问题浏览量')
    
  } catch (error) {
    console.error('获取问题详情失败', error)
    ElMessage.error('获取问题详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(async () => {
  await fetchQuestionDetail()
})
</script>

<style scoped>
.question-detail {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-container {
  padding: 20px;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: 20px;
}

.question-card {
  margin-bottom: 30px;
  border-radius: 8px;
}

.question-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.question-title {
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  color: #303133;
}

.question-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: #606266;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.question-content {
  padding: 0 10px;
}

.question-asker {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.asker-info {
  display: flex;
  flex-direction: column;
}

.asker-name {
  font-weight: bold;
  color: #303133;
}

.asker-role {
  font-size: 0.9rem;
  color: #606266;
}

.question-text {
  line-height: 1.6;
  margin-bottom: 30px;
}

.question-attachments h4 {
  margin-bottom: 10px;
  color: #303133;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-size {
  color: #909399;
  font-size: 0.9rem;
}

.section-title {
  margin: 40px 0 20px 0;
  font-size: 1.5rem;
  color: #303133;
  position: relative;
  padding-left: 15px;
  font-weight: 500;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 5px;
  height: calc(100% - 10px);
  width: 4px;
  background-color: #409eff;
  border-radius: 2px;
}

.answer-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.expert-info {
  display: flex;
  gap: 15px;
}

.expert-details {
  display: flex;
  flex-direction: column;
}

.expert-name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.expert-title, .expert-org {
  font-size: 0.9rem;
  color: #606266;
}

.answer-meta {
  color: #909399;
  font-size: 0.9rem;
}

.answer-date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.answer-content {
  line-height: 1.6;
  margin-bottom: 20px;
}

.answer-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.related-card {
  border-radius: 8px;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item {
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.related-item:last-child {
  border-bottom: none;
}

.related-item a {
  display: block;
  color: #409eff;
  margin-bottom: 10px;
  text-decoration: none;
  font-weight: 500;
}

.related-item a:hover {
  color: #337ecc;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #909399;
}

.related-answers {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ask-card {
  border-radius: 8px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.ask-header h3 {
  margin: 0;
  color: #303133;
}

.ask-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.ask-content p {
  margin-bottom: 20px;
  color: #606266;
}

@media (max-width: 768px) {
  .question-title {
    font-size: 1.5rem;
  }
  
  .question-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .answer-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .expert-info {
    width: 100%;
  }
  
  .answer-meta {
    width: 100%;
  }
}
</style> 