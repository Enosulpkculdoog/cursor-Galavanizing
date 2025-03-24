<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-sections">
        <!-- 平台简介 -->
        <div class="footer-section about-section">
          <div class="footer-logo">
            <div class="footer-logo-icon">{{ $t('site.logo') }}</div>
            <div class="footer-logo-text">{{ $t('site.name') }}</div>
          </div>
          <p class="footer-description">
            {{ $t('footer.description') }}
          </p>
          <div class="social-links">
            <a href="#" class="social-link"><el-icon><Message /></el-icon></a>
            <a href="#" class="social-link"><el-icon><Connection /></el-icon></a>
            <a href="#" class="social-link"><el-icon><Share /></el-icon></a>
          </div>
        </div>
        
        <!-- 快速链接 -->
        <div class="footer-section links-section">
          <h3>{{ $t('footer.quickLinks') }}</h3>
          <ul class="footer-links">
            <li><router-link to="/technical-guide">{{ $t('footer.links.zincTestingMethods') }}</router-link></li>
            <li><router-link to="/industry-solutions">{{ $t('footer.links.industrialApplications') }}</router-link></li>
            <li><router-link to="/standards-database">{{ $t('footer.links.standardsComparison') }}</router-link></li>
            <li><router-link to="/testing-service">{{ $t('footer.links.testingAppointment') }}</router-link></li>
            <li><a href="#">{{ $t('footer.links.downloads') }}</a></li>
          </ul>
        </div>
        
        <!-- 行业资源 -->
        <div class="footer-section resources-section">
          <h3>{{ $t('footer.industryResources') }}</h3>
          <ul class="footer-links">
            <li><a href="#">{{ $t('footer.resources.annualReport') }}</a></li>
            <li><a href="#">{{ $t('footer.resources.technicalPapers') }}</a></li>
            <li><a href="#">{{ $t('footer.resources.dataDashboard') }}</a></li>
            <li><a href="#">{{ $t('footer.resources.expertQA') }}</a></li>
            <li><a href="#">{{ $t('footer.resources.zincPrice') }}</a></li>
          </ul>
        </div>
        
        <!-- 联系信息 -->
        <div class="footer-section contact-section">
          <h3>{{ $t('footer.contactUs') }}</h3>
          <ul class="contact-info">
            <li>
              <el-icon><Location /></el-icon>
              <span>{{ $t('footer.contactInfo.address') }}</span>
            </li>
            <li>
              <el-icon><Phone /></el-icon>
              <span>{{ $t('footer.contactInfo.phone') }}</span>
            </li>
            <li>
              <el-icon><Message /></el-icon>
              <span>{{ $t('footer.contactInfo.email') }}</span>
            </li>
          </ul>
          
          <div class="newsletter">
            <h4>{{ $t('footer.newsletter.title') }}</h4>
            <div class="newsletter-form">
              <el-input 
                v-model="email" 
                :placeholder="$t('footer.newsletter.placeholder')" 
                class="newsletter-input" 
              />
              <el-button type="primary" @click="subscribe">{{ $t('footer.newsletter.subscribe') }}</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} {{ $t('footer.copyright') }}
        </div>
        <div class="terms-links">
          <a href="#">{{ $t('footer.terms') }}</a>
          <a href="#">{{ $t('footer.privacy') }}</a>
          <a href="#">{{ $t('footer.sitemap') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Message, Connection, Share, Location, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 订阅邮箱
const email = ref('')

// 获取当前年份
const currentYear = computed(() => new Date().getFullYear())

// 订阅功能
const subscribe = () => {
  if (!email.value) {
    ElMessage.warning('请输入您的邮箱地址')
    return
  }
  
  // 简单的邮箱验证
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }
  
  // 模拟订阅成功
  ElMessage.success('订阅成功！感谢您的关注')
  email.value = ''
}
</script>

<style scoped>
.app-footer {
  background-color: #334155;
  color: #e2e8f0;
  padding: 40px 0 20px;
  width: 100%;
  margin-top: 40px;
}

.footer-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
  min-width: 240px;
}

/* 平台简介区域 */
.about-section {
  flex: 1.5;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.footer-logo-icon {
  width: 38px;
  height: 38px;
  background-color: var(--accent-color);
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.footer-logo-text {
  font-size: 18px;
  font-weight: 600;
}

.footer-description {
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.9;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  font-size: 18px;
}

.social-link:hover {
  background-color: var(--accent-color);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 链接区域 */
.footer-section h3 {
  font-size: 20px;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 12px;
  font-weight: 600;
}

.footer-section h3:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 1.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 15px;
}

.footer-links a {
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.3s ease;
  opacity: 0.8;
  display: inline-block;
  padding: 3px 0;
}

.footer-links a:hover {
  color: var(--accent-color);
  padding-left: 8px;
  opacity: 1;
}

/* 联系信息区域 */
.contact-info {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 14px;
}

.contact-info .el-icon {
  margin-right: 10px;
  margin-top: 3px;
  flex-shrink: 0;
  font-size: 16px;
  color: var(--accent-color);
}

/* 订阅区域 */
.newsletter {
  margin-top: 15px;
}

.newsletter h4 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.newsletter-form {
  display: flex;
  gap: 8px;
}

.newsletter-input {
  flex: 1;
  min-width: 160px;
}

.newsletter-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.08);
  border: none;
  box-shadow: none;
  border-radius: 6px;
}

.newsletter-input :deep(.el-input__inner) {
  color: white;
  height: 36px;
}

.newsletter-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-form .el-button {
  height: 36px;
  padding: 0 15px;
  font-size: 14px;
  border-radius: 6px;
}

/* 底部版权信息 */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 12px;
}

.copyright {
  font-size: 13px;
  opacity: 0.8;
}

.terms-links {
  display: flex;
  gap: 15px;
}

.terms-links a {
  color: #e2e8f0;
  text-decoration: none;
  opacity: 0.7;
  font-size: 13px;
  transition: color 0.3s;
}

.terms-links a:hover {
  color: var(--accent-color);
  opacity: 1;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .footer-container {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .footer-section {
    min-width: 220px;
  }
  
  .footer-sections {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-sections {
    flex-direction: column;
    gap: 40px;
  }
  
  .footer-section {
    margin-bottom: 0;
    width: 100%;
  }
  
  .about-section {
    flex: 1;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .terms-links {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 40px 0 20px;
  }
  
  .footer-container {
    padding: 0 15px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-input {
    margin-bottom: 0;
    width: 100%;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-section h3:after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-section h3,
  .footer-description {
    text-align: center;
  }
  
  .footer-links li {
    text-align: center;
  }
}
</style> 