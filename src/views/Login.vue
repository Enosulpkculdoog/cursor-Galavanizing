<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img src="/logo.png" alt="Logo" class="logo" />
        <h1>{{ $t('login.title') }}</h1>
      </div>
      
      <el-form 
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="top"
      >
        <el-form-item :label="$t('login.username')" prop="username">
          <el-input 
            v-model="loginForm.username"
            :placeholder="$t('login.usernamePlaceholder')"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input 
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('login.passwordPlaceholder')"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        
        <div class="remember-forgot">
          <el-checkbox v-model="loginForm.remember">{{ $t('login.rememberMe') }}</el-checkbox>
          <el-button text type="primary" @click="forgotPassword">{{ $t('login.forgotPassword') }}</el-button>
        </div>
        
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ $t('login.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="language-selector">
        <el-dropdown @command="handleLanguageChange">
          <span class="language-dropdown">
            {{ currentLanguageLabel }} <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
              <el-dropdown-item command="en-US">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: () => store.getters.currentLocale === 'zh-CN' ? '请输入用户名' : 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: () => store.getters.currentLocale === 'zh-CN' ? '请输入密码' : 'Please enter password', trigger: 'blur' }
  ]
})

// 状态
const loading = ref(false)
const loginFormRef = ref(null)

// 当前语言标签
const currentLanguageLabel = computed(() => {
  return store.getters.currentLocale === 'zh-CN' ? '中文' : 'English'
})

// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        await store.dispatch('login', {
          username: loginForm.username,
          password: loginForm.password
        })
        
        // 登录成功后跳转
        const redirectPath = route.query.redirect || '/'
        router.push(redirectPath)
        
        ElMessage({
          type: 'success',
          message: store.getters.currentLocale === 'zh-CN' ? '登录成功' : 'Login successful'
        })
      } catch (error) {
        ElMessage({
          type: 'error',
          message: store.getters.currentLocale === 'zh-CN' ? '登录失败，请检查用户名和密码' : 'Login failed, please check your username and password'
        })
      } finally {
        loading.value = false
      }
    }
  })
}

// 忘记密码
const forgotPassword = () => {
  ElMessage({
    type: 'info',
    message: store.getters.currentLocale === 'zh-CN' ? '密码重置功能正在开发中' : 'Password reset feature is under development'
  })
}

// 切换语言
const handleLanguageChange = (lang) => {
  store.dispatch('setLocale', lang)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  margin-top: 10px;
  padding: 12px 0;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
}

.language-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #409EFF;
}

@media (max-width: 480px) {
  .login-container {
    width: 90%;
    padding: 30px 20px;
  }
}
</style> 