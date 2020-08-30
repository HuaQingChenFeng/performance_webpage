<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-office-building"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item> 发布公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-head">
                <el-button type="primary" icon="el-icon-s-promotion" size="small" class="btn" @click="toEditor">发布新公告</el-button>
            </div>
            <el-tabs v-model="message">
                <el-tab-pane :label="`已发布(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="toAticle(scope.row.releaseId)">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="recallAticle(scope.row._id, scope.row.releaseId)">撤回</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`已撤回(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="toAticle(scope.row.releaseId)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-button type="success" @click="editAticle(scope.row.releaseId)">编辑</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="deleteAticle(scope.row._id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`草稿(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="toAticle(scope.row.releaseId)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-button type="success" @click="editAticle(scope.row.releaseId)">编辑</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="deleteAticle(scope.row._id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import { reqGetNotice, reqDeleteReleaseNotice, reqRecallNotice } from '../../../api/index'
    import { mapState } from 'vuex';
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unread: [],
                read: [],
                recycle: []
            }
        },
        mounted() {
            this.getDataList()
        },
        computed: {
            ...mapState(['newNotice']),
            unreadNum(){
                return this.unread.length;
            }
        },
        watch:{
            'newNotice'(){
                this.getDataList();
            }
        },
        methods: {
            //获取公告
            getDataList(){
                reqGetNotice({status: 0}).then(res => {
                    if (res.code === 0){
                        const notice = res.data
                        console.log('全部公告')
                        console.log(notice)
                        this.unread = [];
                        this.recycle = [];
                        this.read = [];
                        notice.forEach(item => {
                            if(item.status == 1){
                                this.unread.push(item)
                            }
                            if(item.status == 0){
                                this.recycle.push(item)
                            }
                            if(item.status == 2){
                                this.read.push(item)
                            }
                        })
                    }
                })
            },
            //发布公告
            toEditor(){
                this.$router.push('/editor');
            },
            //公告详情
            toAticle(releaseId){
                this.$router.push({
                    path:'article',
                    query:{
                        releaseId:releaseId
                    }
                })

            },

            //编辑公告
            editAticle(releaseId){
                this.$router.push({
                    path:'editor',
                    query:{
                        releaseId:releaseId
                    }
                })
            },

            //撤回公告
            recallAticle( _id, releaseId ){
                reqRecallNotice({_id, releaseId}).then(res => {
                    if(res.code === 0){
                        this.$message.success('撤回公告成功！');
                        this.getDataList()
                    } else {
                        this.$message.error('撤回公告失败，请稍后再试');
                    }
                })
            },

            //删除公告
            deleteAticle(_id){
                reqDeleteReleaseNotice({_id}).then(res => {
                    if(res.code === 0){
                        this.$message.success('删除公告成功！');
                        this.getDataList()
                    } else {
                        this.$message.error('删除公告失败，请稍后再试');
                    }
                })
            },

        },
    }

</script>

<style lang="scss" scoped>
    .container{
        .container-head{
            margin-bottom: 10px;
        }
    }
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
</style>

