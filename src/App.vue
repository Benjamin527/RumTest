<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted, onUnmounted } from 'vue'

// 声明window.datafluxRum类型
declare global {
  interface Window {
    datafluxRum?: {
      setUser?: (user: { id: string }) => void
      addRumGlobalContext?: (key: string, value: string) => void
    }
  }
}

// 随机生成用户ID的函数
function generateRandomId() {
  return Math.random().toString(36).substr(2, 10)
}

const userId = ref('1234567890')

function switchUserId() {
  userId.value = generateRandomId()
  if (window.datafluxRum && window.datafluxRum.setUser) {
    window.datafluxRum.setUser({
      id: userId.value
    })
  }
}

const stepTimestamps = ref<number[]>([])

// function formatDuration(ms: number) {
//   if (ms < 1000) return `${ms}ms`
//   const s = Math.floor(ms / 1000)
//   if (s < 60) return `${s}s`
//   const m = Math.floor(s / 60)
//   if (m < 60) return `${m}m${s % 60 ? (s % 60 + 's') : ''}`
//   const h = Math.floor(m / 60)
//   return `${h}h${m % 60 ? (m % 60 + 'm') : ''}`
// }

function handleStepClick(step: number) {
  const now = Date.now()
  stepTimestamps.value[step - 1] = now
  if (step > 1 && stepTimestamps.value[step - 2]) {
    const diff = now - stepTimestamps.value[step - 2]
    if (window.datafluxRum && window.datafluxRum.addRumGlobalContext) {
      window.datafluxRum.addRumGlobalContext(`step${step - 1}_${step}_time_cost`, diff)
    }
  }
}

// WebSocket 相关逻辑
const wsMessages = ref<string[]>([])
let ws: WebSocket | null = null

function startWebSocket() {
  if (ws) return // 已连接则不重复连接
  ws = new WebSocket('wss://echo.websocket.org')
  ws.onopen = () => {
    wsMessages.value.push('WebSocket已连接')
    ws!.send('Hello Server!')
  }
  ws.onmessage = (event) => {
    wsMessages.value.push('收到: ' + event.data)
  }
  ws.onerror = (err) => {
    wsMessages.value.push('WebSocket错误: ' + (err instanceof Event ? '连接错误' : String(err)))
  }
  ws.onclose = () => {
    wsMessages.value.push('WebSocket已关闭')
    ws = null
  }
}

onUnmounted(() => {
  ws && ws.close()
})
</script>

<template>
  <div style="position: relative; min-height: 100vh;">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    
    <nav class="test-nav">
      <router-link to="/test0/index/home" @click.native="startWebSocket">测试页面 0</router-link> |
      <router-link to="/test/index/home" @click.native="startWebSocket">测试页面 1</router-link>
    </nav>
    
    <div v-if="wsMessages.length" style="max-width: 600px; margin: 0 auto 20px; padding: 16px; background: #f6f8fa; border-radius: 8px;">
      <h4>WebSocket 消息：</h4>
      <ul>
        <li v-for="(msg, idx) in wsMessages" :key="idx">{{ msg }}</li>
      </ul>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; margin: 40px 0; gap: 20px;">
      <button @click="handleStepClick(1)">第一步</button>
      <button @click="handleStepClick(2)">第二步</button>
      <button @click="handleStepClick(3)">第三步</button>
      <button @click="handleStepClick(4)">第四步</button>
    </div>

    <HelloWorld msg="Vite + Vue" />
    <router-view></router-view>


    <button 
      @click="switchUserId" 
      style="position: fixed; right: 30px; bottom: 30px; z-index: 999; padding: 12px 24px; background: #42b883; color: #fff; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
    >
      切换用户id (当前: {{ userId }})
    </button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.test-nav {
  padding: 20px;
  text-align: center;
}

.test-nav a {
  margin: 0 10px;
  color: #646cff;
  text-decoration: none;
}

.test-nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>
