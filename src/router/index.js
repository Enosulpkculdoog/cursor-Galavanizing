import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import i18n from '../i18n'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { titleKey: 'nav.home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { titleKey: 'user.login' }
  },
  {
    path: '/technical-guide',
    name: 'TechnicalGuide',
    component: () => import('../views/TechnicalGuide.vue'),
    meta: { titleKey: 'nav.technicalGuide' }
  },
  {
    path: '/technical-guide/:section',
    name: 'TechnicalGuideSection',
    component: () => import('../views/TechnicalGuide.vue'),
    meta: { titleKey: 'nav.technicalGuide' }
  },
  {
    path: '/testing-service',
    name: 'TestingService',
    component: () => import('../views/TestingService.vue'),
    meta: { titleKey: 'nav.testingService' }
  },
  {
    path: '/industry-solutions',
    name: 'IndustrySolutions',
    component: () => import('../views/IndustrySolutions.vue'),
    meta: { titleKey: 'nav.industrySolutions' }
  },
  {
    path: '/standards-database',
    name: 'StandardsDatabase',
    component: () => import('../views/StandardsDatabase.vue'),
    meta: { titleKey: 'nav.standardsDatabase' }
  },
  {
    path: '/standards-database/:id',
    name: 'StandardDetail',
    component: () => import('../views/StandardDetail.vue'),
    meta: { titleKey: 'standards.detail.title' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { titleKey: 'about.title' }
  },
  {
    path: '/standards',
    name: 'Standards',
    component: () => import('../views/Standards.vue'),
    meta: { titleKey: 'nav.standardsDatabase' }
  },
  {
    path: '/solutions',
    name: 'Solutions',
    component: () => import('../views/Solutions.vue'),
    meta: { titleKey: 'nav.solutions' }
  },
  {
    path: '/standards/:id',
    name: 'StandardDetail',
    component: () => import('../views/StandardDetail.vue'),
    meta: { titleKey: 'standards.detail.title' }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('../views/Resources.vue'),
    meta: { titleKey: 'nav.resources' }
  },
  {
    path: '/resources/annual-report',
    name: 'AnnualReport',
    component: () => import('../views/resources/AnnualReport.vue')
  },
  {
    path: '/resources/papers',
    name: 'Papers',
    component: () => import('../views/resources/Papers.vue')
  },
  {
    path: '/resources/papers/:id',
    name: 'PaperDetail',
    component: () => import('../views/resources/PaperDetail.vue')
  },
  {
    path: '/resources/data-dashboard',
    name: 'DataDashboard',
    component: () => import('../views/resources/DataDashboard.vue')
  },
  {
    path: '/resources/expert-qa',
    name: 'ExpertQA',
    component: () => import('../views/resources/ExpertQA.vue')
  },
  {
    path: '/resources/expert-qa/:id',
    name: 'QuestionDetail',
    component: () => import('../views/resources/QuestionDetail.vue')
  },
  {
    path: '/resources/zinc-price',
    name: 'ZincPrice',
    component: () => import('../views/resources/ZincPrice.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { titleKey: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  const titleKey = to.meta.titleKey || 'nav.home'
  const title = i18n.global.t(titleKey)
  document.title = `${title} - ${i18n.global.t('site.name')}`
  
  // 检查是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 