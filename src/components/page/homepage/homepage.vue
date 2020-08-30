<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img :src="imageUrl" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userInfo.name}}</div>
                            <div>{{userInfo.username}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        职位：
                        <span>{{userInfo.position}}</span>
                    </div>
                    <div class="user-info-list">
                        主考人：
                        <span>{{userInfo.linearLeader}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>上月工资：{{examineInfo.totalWage}}元</span>
                    </div>
                    基本工资:{{examineInfo.salary}}
                    <el-progress :percentage="percentage.salary" color="#42b983"></el-progress>
                    绩效工资:{{examineInfo.meritPay}}
                    <el-progress :percentage="percentage.meritPay" color="#f1e05a"></el-progress>
                    住房补贴:{{examineInfo.mealSupplement}}
                    <el-progress :percentage="percentage.mealSupplement"></el-progress>
                    餐补:{{examineInfo.housingSubsidies}}
                    <el-progress :percentage="percentage.housingSubsidies" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{examineInfo.evaluationScoreTotal || '0'}}</div>
                                    <div>自评得分</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{examineInfo.examinedScoreTotal || '0'}}</div>
                                    <div>考核得分</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{(examineInfo.evaluationScoreTotal+examineInfo.examinedScoreTotal)/2 || '0'}}</div>
                                    <div>最终得分</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:460px; overflow: auto">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0"
                                   @click="dialogFormVisible = true"
                                   type="text">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status" @change="updataNote(scope.row._id,scope.row.status)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div
                                    class="todo-item"
                                    :class="{'todo-item-del': scope.row.status}"
                                >{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-delete" @click="deleteNote(scope.row._id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="代办事项" :visible.sync="dialogFormVisible">
            <div class="text">
                <el-input type="textarea"
                          :rows="2"
                          placeholder="请输入少于50字的内容"
                          v-model="textarea"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNote">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import { mapState } from 'vuex';
import { reqAddNote, reqEditNote, reqDeleteNote, reqGetNoteList, reqGetWages } from '../../../api/index';
export default {
    name: 'dashboard',
    data() {
        return {
            textarea:'',//代办便签内容
            dialogFormVisible: false,
            examineInfo:{},//本月得分情况
            percentage:{
                salary: 0,
                meritPay: 0,
                mealSupplement: 0,
                housingSubsidies: 0
            },//本月百分比
            name: localStorage.getItem('ms_username'),
            defaultSrc: require('../../../assets/img/img.jpg'),
            imageUrl: '',
            todoList: [],
        };
    },
    components: {
        Schart
    },
    computed: {
        ...mapState(['userInfo', 'baseDate']),
    },
    created() {
        if(this.userInfo.picture !== ''){
            this.imageUrl = this.userInfo.picture
        } else {
            this.imageUrl = this.defaultSrc
        }
        this.getNoteList();
        this.getExamineInfo();
    },
    watch:{
        'userInfo'(){
            if(this.userInfo.picture !== ''){
                this.imageUrl = this.userInfo.picture
            } else {
                this.imageUrl = this.defaultSrc
            }
        },
        'baseDate'(){
            this.getExamineInfo();
            this.getExamineInfo()
        }
    },
    methods: {
        //获取代办事项列表内容
        getNoteList(){
            const userId = this.userInfo.id;
            reqGetNoteList({userId}).then(res =>{
                if(res.code === 0){
                  this.todoList = res.data
                }
            })
        },
        //获取当前月绩效信息
        getExamineInfo(){
            const userId = this.userInfo.id;
            const baseDate = this.baseDate;
            reqGetWages({ userId, baseDate}).then(res => {
                console.log(res , '工资')
                if(res.code === 0){
                    this.examineInfo = res.data;
                    this.percentage = {
                        salary: parseInt((this.examineInfo.salary/this.examineInfo.totalWage)*100),
                        meritPay: parseInt((this.examineInfo.meritPay/this.examineInfo.totalWage)*100),
                        mealSupplement: parseInt((this.examineInfo.mealSupplement/this.examineInfo.totalWage)*100),
                        housingSubsidies: parseInt((this.examineInfo.housingSubsidies/this.examineInfo.totalWage)*100)
                    }
                    if(this.percentage.meritPay < 0){
                        this.percentage.meritPay = 0
                    }
                } else {
                    this.examineInfo = {
                        evaluationScoreTotal: 0, //自评总得分
                        examinedScoreTotal: 0, //主考人得分
                        salary:0, //月薪
                        finalScoreTotal: 0, //总得分
                        totalWage:0,//总工资
                        meritPay: 0,//绩效工资
                        mealSupplement: 0,//餐补
                        housingSubsidies: 0//住房补贴
                    }
                }
            });
        },
        //新增代办事项
        addNote(){
            reqAddNote({userId:this.userInfo.id, title: this.textarea}).then(res => {
                if(res.code === 0){
                    this.$message.success('新增待办事项成功')
                    this.dialogFormVisible = false
                    this.getNoteList()
                } else {
                    this.$message.error('新增待办事项失败')
                }
            })
        },
        //修改标签状态
        updataNote(_id, status){
            reqEditNote({_id,status}).then(res => {
                if(res.code === 0){
                    this.getNoteList()
                }
            })
        },
        //删除待办事项
        deleteNote(_id){
            reqDeleteNote({_id}).then(res => {
                if(res.code === 0){
                    this.getNoteList();
                }
            })
        },


        changeDate() {

            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },

    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
