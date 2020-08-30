<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" v-if="!item.admin || userInfo.type == 'admin'">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '我的绩效卡',
                    admin: false,
                },
                {
                    icon: 'el-icon-office-building',
                    index: '2',
                    title: '系统管理',
                    admin: true,
                    subs: [
                        {
                            index: 'enterprise',
                            title: '企业架构'
                        },
                        {
                            index: 'user',
                            title: '用户管理'
                        },
                        {
                            index: 'announcement',
                            title: '发布公告'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-copy',
                    title: '通知信息',
                    index: 'tabs',
                    admin: false,
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '绩效内容',
                    admin: false,
                    subs: [
                        {
                            index: 'form',
                            title: 'KPI'
                        },
                        {
                            index: 'value',
                            title: '绩效考核时间表'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'team',
                    title: '团队管理',
                    admin: false,
                },
                {
                    icon: 'el-icon-s-custom',
                    index: '5',
                    title: '个人中心',
                    admin: false,
                    subs: [
                        {
                            index: 'mine',
                            title: '个人信息'
                        },
                        {
                            index: 'password',
                            title: '修改密码'
                        }
                    ]
                },
                /*{
                    icon: 'el-icon-lx-redpacket_fill',
                    index: '/donate',
                    title: '权限归属'
                }*/
            ]
        };
    },
    computed: {
        ...mapState(['userInfo']),
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        console.log(this.userInfo)
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
