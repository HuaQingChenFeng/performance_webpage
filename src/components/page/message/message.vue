<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 通知管理</el-breadcrumb-item>
                <el-breadcrumb-item> 通知信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="[toAticle(scope.row.releaseId),handleRead(scope.row)]">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="toAticle(scope.row.receivingId)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
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
    import { reqDeleteReadNotice, reqGetNoticeList, reqReadyReadNotice} from '../../../api/index';
    import { mapState } from 'vuex'
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unread: [],
                read: [],
            }
        },
        created() {
            this.getDataList();
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
            //获取消息列表
            getDataList(){
                console.log('调用消息列表')
                reqGetNoticeList().then(res => {
                    console.log(res)
                    if(res.code == 0){
                        this.unread = res.data.unReadDataList || []
                        console.log(this.unread)
                        this.read = res.data.readDataList || []
                    } else {

                    }
                })
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

            //标记公告为已读
            handleRead(row){
                console.log('进入')
                reqReadyReadNotice(row).then(res => {
                    console.log('进入纷纷')
                    if(res.code === 0){
                      this.getDataList();
                        this.$message.success('操作成功！');
                    } else {
                        this.$message.error('操作失败，请稍后再试');
                    }
                })
            },

            //删除公告
            deleteAticle(_id){
                reqDeleteReadNotice({_id}).then(res => {
                    if(res.code === 0){
                        this.$message.success('删除公告成功！');
                        this.getDataList()
                    } else {
                        this.$message.error('删除公告失败，请稍后再试');
                    }
                })
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

