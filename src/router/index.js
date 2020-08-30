import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '绩效考核' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/homepage/homepage.vue'),
                    meta: { title: '我的绩效卡' }
                },
                {
                    path: '/mine',
                    component: () => import('../components/page/mine/mine.vue'),
                    meta: { title: '个人信息' }
                },
                {
                    path: '/password',
                    component: () => import('../components/page/mine/password.vue'),
                    meta: { title: '修改密码' }
                },
                {
                    path: '/team',
                    component: () => import('../components/page/team/team.vue'),
                    meta: { title: '团队管理' }
                },
                {
                    path: '/user',
                    component: () => import('../components/page/administrators/user.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/tabs',
                    component: () => import('../components/page/message/message.vue'),
                    meta: { title: '通知信息' }
                },
                {
                    path: '/announcement',
                    component: () => import('../components/page/message/announcement.vue'),
                    meta: { title: '发布公告' }
                },
                {
                    path: '/form',
                    component: () => import('../components/page/kpi/kpi.vue'),
                    meta: { title: 'KPI' }
                },
                {
                    path: '/value',
                    component: () => import('../components/page/kpi/value.vue'),
                    meta: { title: '考核时间表' }
                },
                {
                    path: '/suggest',
                    component: () => import('../components/page/evaluate/suggest/suggest.vue'),
                    meta: { title: '个人绩效总结' }
                },
                {
                    path: '/summarize',
                    component: () => import('../components/page/evaluate/summarize/summarize.vue'),
                    meta: { title: '绩效面谈记录' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import('../components/page/message/editor.vue'),
                    meta: { title: '文本编辑器' }
                },
                {
                    // 公告详情
                    path: '/article',
                    component: () => import('../components/page/message/components/article'),
                    meta: { title: '公告详情' }
                },
                {
                    // 公告详情
                    path: '/enterprise',
                    component: () => import('../components/page/administrators/enterprise'),
                    meta: { title: '企业架构' }
                },


                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import('../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import('../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import('../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import('../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import('../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import('../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import('../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import('../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import('../components/page/Donate.vue'),
                    meta: { title: '权限归属' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/login/login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
