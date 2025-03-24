<template>
  <div class="not-found">
    <NavHeader />
    
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>{{ $t('notFound.title') }}</h1>
      <p>{{ $t('notFound.message') }}</p>
      <el-button type="primary" @click="$router.push('/')">
        {{ $t('notFound.backHome') }}
      </el-button>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import NavHeader from '../components/NavHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.not-found-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #409EFF;
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 2rem;
  max-width: 600px;
}
</style> 