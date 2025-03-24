<template>
  <div class="nav-header">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="logo">
        <router-link to="/">
          <div class="logo-icon">{{ $t('site.logo') }}</div>
          <div class="logo-text">{{ $t('site.name') }}</div>
        </router-link>
      </div>
      
      <!-- 导航区域 -->
      <div class="nav-links" :class="{ 'nav-active': mobileMenuActive }">
        <router-link to="/" class="nav-item" active-class="active" exact>{{ $t('nav.home') }}</router-link>
        <router-link to="/solutions" class="nav-item" active-class="active">{{ $t('nav.solutions') }}</router-link>
        <router-link to="/technical-guide" class="nav-item" active-class="active">{{ $t('nav.technicalGuide') }}</router-link>
        <router-link to="/testing-service" class="nav-item" active-class="active">{{ $t('nav.testingService') }}</router-link>
        <router-link to="/industry-solutions" class="nav-item" active-class="active">{{ $t('nav.industrySolutions') }}</router-link>
        <router-link to="/standards-database" class="nav-item" active-class="active">{{ $t('nav.standardsDatabase') }}</router-link>
        <router-link to="/resources" class="nav-item" active-class="active">{{ $t('nav.resources') }}</router-link>
      </div>
      
      <!-- 功能区域 -->
      <div class="nav-actions">
        <div class="search-box">
          <el-input 
            v-model="searchQuery" 
            :placeholder="$t('common.search')" 
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 语言切换 -->
        <div class="language-switch">
          <el-dropdown @command="handleLanguageChange" trigger="click">
            <span class="language-selector">
              {{ currentLanguage === 'zh-CN' ? '中文' : 'English' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                <el-dropdown-item command="en-US">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
        <div class="user-actions">
          <el-dropdown trigger="click">
            <el-button circle class="user-button">
              <el-icon><User /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openLoginDialog">{{ $t('user.login') }}</el-dropdown-item>
                <el-dropdown-item @click="openRegisterDialog">{{ $t('user.register') }}</el-dropdown-item>
                <el-dropdown-item divided>{{ $t('user.manual') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('user.contactUs') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
        <!-- 移动菜单按钮 -->
        <div class="mobile-menu-toggle" @click="toggleMobileMenu">
          <el-icon v-if="!mobileMenuActive"><Menu /></el-icon>
          <el-icon v-else><Close /></el-icon>
        </div>
      </div>
    </div>
    
    <!-- 登录对话框 -->
    <el-dialog v-model="loginDialogVisible" :title="$t('user.login')" width="400px">
      <el-form :model="loginForm" label-position="top">
        <el-form-item :label="$t('user.username')">
          <el-input v-model="loginForm.username" :placeholder="$t('user.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('user.password')">
          <el-input v-model="loginForm.password" type="password" :placeholder="$t('user.passwordPlaceholder')" show-password />
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="loginForm.remember">{{ $t('user.rememberMe') }}</el-checkbox>
          <a href="#" class="forgot-password">{{ $t('user.forgotPassword') }}</a>
        </div>
        <el-form-item>
          <el-button type="primary" style="width: 100%">{{ $t('user.login') }}</el-button>
        </el-form-item>
        <div class="login-footer">
          <span>{{ $t('user.noAccount') }}</span>
          <a href="#" @click.prevent="switchToRegister">{{ $t('user.register') }}</a>
        </div>
      </el-form>
    </el-dialog>
    
    <!-- 注册对话框 -->
    <el-dialog v-model="registerDialogVisible" :title="$t('user.register')" width="400px">
      <el-form :model="registerForm" label-position="top">
        <el-form-item :label="$t('user.username')">
          <el-input v-model="registerForm.username" :placeholder="$t('user.setUsername')" />
        </el-form-item>
        <el-form-item :label="$t('user.email')">
          <el-input v-model="registerForm.email" :placeholder="$t('user.emailPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('user.role')">
          <el-select v-model="registerForm.role" :placeholder="$t('user.selectRole')" style="width: 100%">
            <el-option :label="$t('user.roles.purchaser')" value="purchaser" />
            <el-option :label="$t('user.roles.quality')" value="quality" />
            <el-option :label="$t('user.roles.engineer')" value="engineer" />
            <el-option :label="$t('user.roles.researcher')" value="researcher" />
            <el-option :label="$t('user.roles.other')" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.password')">
          <el-input v-model="registerForm.password" type="password" :placeholder="$t('user.setPassword')" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%">{{ $t('user.register') }}</el-button>
        </el-form-item>
        <div class="login-footer">
          <span>{{ $t('user.hasAccount') }}</span>
          <a href="#" @click.prevent="switchToLogin">{{ $t('user.loginNow') }}</a>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Menu, Close, ArrowDown, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLanguage = computed(() => locale.value)

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// 移动端菜单状态
const mobileMenuActive = ref(false)
const toggleMobileMenu = () => {
  mobileMenuActive.value = !mobileMenuActive.value
}

// 搜索功能
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 实际实现中可以跳转到搜索结果页面
    // router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

// 登录/注册对话框
const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  role: ''
})

const openLoginDialog = () => {
  loginDialogVisible.value = true
  registerDialogVisible.value = false
}

const openRegisterDialog = () => {
  registerDialogVisible.value = true
  loginDialogVisible.value = false
}

const switchToRegister = () => {
  loginDialogVisible.value = false
  registerDialogVisible.value = true
}

const switchToLogin = () => {
  registerDialogVisible.value = false
  loginDialogVisible.value = true
}
</script>

<style scoped>
.nav-header {
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1500px;
  margin: 0 auto;
  padding: 12px 20px;
  width: 100%;
}

/* Logo样式 */
.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.logo a:hover {
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 28px;
  font-weight: bold;
  background: var(--primary-color);
  color: white;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 15px;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(43, 93, 128, 0.2);
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
}

/* 导航链接 */
.nav-links {
  display: flex;
  align-items: center;
}

.nav-item {
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  margin: 0 3px;
  font-size: 17px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--primary-color);
  background-color: rgba(64, 158, 255, 0.08);
}

.nav-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

/* 功能区域 */
.nav-actions {
  display: flex;
  align-items: center;
}

.search-box {
  margin-right: 15px;
}

.search-input {
  width: 220px;
}

.search-input :deep(.el-input__inner) {
  height: 40px;
  font-size: 15px;
}

/* 语言切换 */
.language-switch {
  margin: 0 18px;
}

.language-selector {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 用户操作 */
.user-actions {
  margin-left: 5px;
}

.user-button {
  width: 42px;
  height: 42px;
  font-size: 20px;
  color: var(--primary-color);
  background-color: rgba(64, 158, 255, 0.1);
  border: none;
}

/* 移动菜单按钮 */
.mobile-menu-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--primary-color);
}

/* 登录/注册对话框样式 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.forgot-password {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: var(--primary-color);
}

.login-footer {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
}

.login-footer a {
  color: var(--accent-color);
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-container {
    max-width: 100%;
    padding: 12px 15px;
  }
  
  .nav-links {
    gap: 12px;
  }
  
  .nav-item {
    padding: 8px 12px;
    font-size: 16px;
  }
  
  .search-input {
    width: 180px;
  }
  
  .logo-text {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 992px) {
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    transition: transform 0.3s ease-in-out;
    z-index: 99;
  }
  
  .nav-links.nav-active {
    transform: translateY(0);
  }
  
  .nav-item {
    width: 100%;
    padding: 12px 15px;
    margin: 4px 0;
    font-size: 16px;
  }
  
  .mobile-menu-toggle {
    display: block;
    margin-left: 15px;
  }
  
  .search-box {
    display: none;
  }
  
  .language-switch {
    margin: 0 15px;
  }
}

@media (max-width: 576px) {
  .nav-container {
    padding: 10px 15px;
  }
  
  .logo-text {
    display: none;
  }
  
  .user-button {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }
  
  .language-selector {
    font-size: 14px;
  }
}
</style> 