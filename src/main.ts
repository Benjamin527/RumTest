import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { datafluxRum } from '@cloudcare/browser-rum';
import posthog from 'posthog-js'

posthog.init('phc_QyR904n1u8ZZx7kzyAmtKoXIuDAQlehaAdrANyHmKIP',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

datafluxRum.init({
    applicationId: 'vite3',
    site: 'https://rum-openway.guance.com',
    clientToken: 'c8e8950535734d278575be8e82b50ec4',
    env: 'production',
    version: '1.0.0',
    service: 'browser',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 70,
    compressIntakeRequests: true,
    trackUserInteractions: true,
    // traceType: 'ddtrace', // 非必填，默认为ddtrace，目前支持 ddtrace、zipkin、skywalking_v3、jaeger、zipkin_single_header、w3c_traceparent 6种类型
    allowedTracingOrigins: ['https://api.example.com',/https:\/\/.*\.my-api-domain\.com/],  // 非必填，允许注入trace采集器所需header头部的所有请求列表。可以是请求的origin，也可以是是正则
});

datafluxRum.startSessionReplayRecording()

// 初始用户id
const defaultUserId = ''
datafluxRum.setUser({
    id: defaultUserId,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
})

// 挂载到window，方便App.vue调用
window.datafluxRum = datafluxRum
var test = 1;
if (test === 2) {
    console.log('a is 2');
    datafluxRum && datafluxRum.addRumGlobalContext('time_cost', '12s');
}


const error = new Error('Something wrong occurred.');

datafluxRum.addError(error, {
    pageStatus: 'beta',
});


//const paramKeysList = ['level', 'restartStatus', 'startTime']
//datafluxRum.addRumGlobalContext('searchParamsKey', paramKeysList);
datafluxRum.addRumGlobalContext('searchParamKey_id', '编号');
datafluxRum.addRumGlobalContext('searchParamKey_name', '名称');
datafluxRum.addRumGlobalContext('searchParamKey_type', '类型');
datafluxRum.addRumGlobalContext('searchParamKey_status', '状态');
datafluxRum.addRumGlobalContext('searchParamKey_createTime', '创建时间');
datafluxRum.addRumGlobalContext('searchParamKey_updateTime', '更新时间');

const context = datafluxRum.getGlobalContext();
console.log(context);

const app = createApp(App)
app.use(router)
app.mount('#app')
