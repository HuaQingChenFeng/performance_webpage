<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 绩效内容
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="kpi-header">
                <div class="header-left">
                    <i class="el-icon-chat-dot-round"></i><span class="font">绩效状态</span>
                </div>
                <div class="header-right">
                    <div class="grade">
                        <div>
                            <span class="font">当前状态</span>
                            <span class="score">{{formData.status | statusKey()}}</span>
                        </div>
                    </div>
                    <div class="btn">
                        <el-button type="warning" icon="el-icon-s-tools" v-if="(formData.status === 0 || formData.status === undefined ) && examiner" @click="submitPerformancePlan(10)">提交绩效计划</el-button> <!--0-->
                        <el-button type="danger" icon="el-icon-refresh-left" v-if="formData.status === 10 && examiner" @click="submitPerformancePlan(0)">撤回</el-button> <!--10-->
                        <el-button type="primary" icon="el-icon-circle-check" v-if="formData.status === 10 && examined" @click="submitPerformancePlan(20)" >被考核人确定绩效计划</el-button><!--被考核人10-->
                        <el-button type="primary" icon="el-icon-circle-check" v-if="formData.status === 20 && examiner" @click="submitPerformancePlan(30)">主考下发绩效计划</el-button><!--20-->
                        <el-button type="primary" icon="el-icon-circle-check" v-if="formData.status === 30 && examined" @click="submitPerformancePlan(40)">提交自评结果</el-button><!--30-->
                        <el-button type="danger" icon="el-icon-refresh-left" v-if="formData.status === 40 && examiner" @click="submitPerformancePlan(30)">驳回</el-button><!--30-->
                        <el-button type="success" icon="el-icon-s-promotion" v-if="formData.status === 40 && examiner" @click="submitPerformancePlan(50)">提交考核结果</el-button><!--40-->
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="kpi-header">
                <div class="header-left">
                    <i class="el-icon-s-data"></i><span class="font">KPI</span>
                </div>
                <div class="header-right">
                    <div class="grade">
                        <div>
                            <span class="font">总权重</span>
                            <span class="score">{{formData.weightTotal}}</span>
                        </div>
                        <div>
                            <span class="font">员工自评</span>
                            <span class="score">{{formData.evaluationScoreTotal}}</span>
                        </div>
                        <div>
                            <span class="font">主考评分</span>
                            <span class="score">{{formData.examinedScoreTotal}}</span>
                        </div>
                    </div>
                    <div class="btn">
                        <el-button type="primary" v-if="!modeControl.addDrawer" @click="drawer = true">增加</el-button>
                    </div>
                </div>
            </div>
            <div class="kpi-content">
                <div
                        class="kpi-list"
                        v-for="(item, index) in kpiListArr"
                        :key="index"
                        v-if="kpiListArr.length > 0"
                        :class="{'selected': selectedKpiIndex === index, 'wrong': wrongKpiIndex === index}"
                        @click="showKpiDetail(item, index)"
                >
                    <div class="line">
                        <span class="title">{{ item.targetName }}</span>
                        <span class="weight">权重 {{ item.weight }}</span>
                    </div>
                    <div class="line">
                        <div class="left">
                            <span class="type type-quantify">{{item.scoreGroup}}</span>
                            <span class="type type-company" v-if="item.targetLevel == '0'">公司指标</span>
                        </div>
                        <div class="right">
                            <span>
                                员工评分
                                <i :class="{ 'notice': item.evaluationScore == undefined || item.evaluationScore === '' }">{{ item.evaluationScore | scoreFilter('未评') }}</i>
                            </span>
                            <span>
                                主考评分
                                <i :class="{ 'notice': item.examinedScore == undefined || item.examinedScore === '' }">{{ item.examinedScore | scoreFilter('未评') }}</i>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="kpiListArr.length == 0">暂无KPI信息</div>
            </div>
        </div>
        <div class="container">
            <div class="summarize-header">
                <div class="header-left">
                    <i class="el-icon-document-copy"></i><span class="font">本期绩效总结</span><span class="text">(被考核人填写)</span>
                </div>
                <div class="header-right">
                    <span>
                        <i class="emphasize">*</i>必须细化至每项未达成项目指标
                    </span>
                    <span class="button-wrapper" v-if="!modeControl.examinedWrite">
                        <el-button
                                @click="modeControl.fail = false"
                                plain>编辑</el-button>
                        <el-button
                                @click="submitPerformancePlan(30)"
                                type="primary">保存</el-button>
                    </span>
                </div>
            </div>
            <div class="summarize-content">
                <el-form  ref="targetNotReachRules" :model="formData">
                        <div class="target-list-wrapper">
                            <div class="target-list">
                                <span class="desc">指标达成情况</span>
                                <el-form-item prop="failReason">
                                    <el-input
                                            v-model="formData.failReason"
                                            type="textarea"
                                            :autosize="{ minRows: 4 }"
                                            placeholder="请输入内容"
                                            :disabled="modeControl.fail"
                                    ></el-input>
                                </el-form-item>
                            </div>
                            <div class="target-list">
                                <span class="desc">达成分享、未达成原因分析</span>
                                <el-form-item prop="failResolve">
                                    <el-input
                                            v-model="formData.failResolve"
                                            type="textarea"
                                            :autosize="{ minRows: 4 }"
                                            placeholder="请输入内容"
                                            :disabled="modeControl.fail"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
            </div>
        </div>
        <div class="container">
            <div class="summarize-header">
                <div class="header-left">
                    <i class="el-icon-document"></i><span class="font">绩效面谈记录</span><span class="text">(考核人填写)</span>
                </div>
                <div class="header-right" v-if="!modeControl.examinerWrite">
                    <span class="button-wrapper">
                        <el-button
                                @click="modeControl.work = false"
                                plain>编辑</el-button>
                        <el-button
                                @click="submitPerformancePlan(40)"
                                type="primary">保存</el-button>
                    </span>
                </div>
            </div>
            <div class="summarize-content">
                <el-form  ref="targetNotReachRules" :model="formData">
                        <div class="target-list-wrapper">
                            <div class="target-list">
                                <span class="desc">本月度工作成绩</span>
                                <el-form-item prop="workResult">
                                    <el-input
                                            v-model="formData.workResult"
                                            type="textarea"
                                            :autosize="{ minRows: 4 }"
                                            placeholder="请输入内容"
                                            :disabled="modeControl.work"
                                    ></el-input>
                                </el-form-item>
                            </div>
                            <div class="target-list">
                                <span class="desc">建议改进方面</span>
                                <el-form-item prop="suggestion">
                                    <el-input
                                            :disabled="modeControl.work"
                                            v-model="formData.suggestion"
                                            type="textarea"
                                            :autosize="{ minRows: 4 }"
                                            placeholder="请输入内容"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
            </div>
        </div>
        <!-- 弹出区域 KPI -->
        <el-drawer
                :visible.sync="drawer"
                :before-close="handleClose"
                :modal="false"
                :wrapperClosable="false"
                size="45%"
                :with-header="false">
            <div class="kpiSlide">
                <div class="kpiSlide-header">
                    <div class="left" @click="handleClose">
                        <i class="el-icon-arrow-left"></i><span>返回</span>
                    </div>
                    <div class="right" v-if="formData.status < 40 || examiner">
                        <el-button type="primary" icon="el-icon-check" round @click="saveKpi">保存</el-button>
                        <el-button type="danger" icon="el-icon-delete" round v-if="examiner" @click="removeKpi">删除</el-button>
                    </div>
                </div>
                <div class="kpiSlide-content">
                    <div class="title">KPI指标</div>
                    <el-form ref="form" label-width="80px" :model="selectedKpi">
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="指标名称">
                                    <el-input v-model="selectedKpi.targetName" :disabled="modeControl.addDrawer"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="指标类别">
                                    <el-tooltip
                                            effect="dark"
                                            placement="bottom"
                                    >
                                        <i class="el-icon-view"></i>
                                        <div class="content" slot="content">
                                            <p class="title">【定量KPI-正向↑】指标值越大越好；</p>
                                            <p class="title">【定量KPI-负向↓】指标值越小越好；</p>
                                            <p class="title">【定性KPI-其它】不能按照线性算出得分系数的指标选择其它类型；</p>
                                        </div>
                                    </el-tooltip>
                                    <el-select v-model="selectedKpi.scoreGroup" :disabled="modeControl.addDrawer" placeholder="请选择">
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="权重" prop="weight">
                                    <el-input
                                            :disabled="modeControl.addDrawer"
                                            v-model="selectedKpi.weight"
                                            placeholder="KPI的权重设定应不低于5分，高于100"
                                            @blur="handleWeightBlur"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="指标详情" prop="description">
                                    <el-input
                                            :disabled="modeControl.addDrawer"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            v-model="selectedKpi.description"
                                            placeholder="指标定义/计算方法/任务类型"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="本期目标" prop="currentAims">
                                    <el-input
                                            :disabled="modeControl.addDrawer"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            placeholder="请输入"
                                            v-model="selectedKpi.currentAims"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="本期实际" prop="actualScore">
                                    <el-input
                                            :disabled="modeControl.examinedWrite"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            placeholder="请输入"
                                            v-model="selectedKpi.actualScore"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="计分方法" prop="formula" class="needShowIconInfo">
                                    <el-row>
                                        <el-col :span="1">
                                            <el-tooltip
                                                    class="item"
                                                    effect="dark"
                                                    placement="bottom"
                                            >
                                                <i class="el-icon-view"></i>
                                                <div class="content" slot="content">
                                                    <div class="block">
                                                        <p class="line"><i class="strong">1、</i>定量KPI-正向和定量KPI-负向，指标得分按线性计算；
                                                        </p>
                                                        <p class="line"><i class="strong">2、</i>定量KPI-其它，可根据指标性质合理调整实际得分系数；
                                                        </p>
                                                        <p class="line"><i class="strong">3、</i>定性KPI，指标得分以上级的定性评价为准；
                                                        </p>
                                                    </div>
                                                    <div class="block">
                                                        <div>
                                                            <p class="title" style="display: inline-block;">例：</p>
                                                        </div>
                                                        <p class="line"><i class="strong">A.</i>超预期完成，并取得较大效果，得分系数为1.3；
                                                        </p>
                                                        <p class="line"><i class="strong">B.</i>100%按时按质完成，得分系数为1.1；
                                                        </p>
                                                        <p class="line"><i class="strong">C.</i>综合完成率80%-99%之间，得分系数为1；
                                                        </p>
                                                        <p class="line"><i class="strong">D.</i>综合完成率50%-80%之间，得分系数为0.8；
                                                        </p>
                                                        <p class="line"><i class="strong">E.</i>综合完成率小于50%，得分系数为0.6。</p>
                                                    </div>
                                                </div>
                                            </el-tooltip>
                                        </el-col>
                                        <el-col :span="23">
                                            <el-input
                                                    :disabled="modeControl.addDrawer"
                                                    v-model="selectedKpi.formula"
                                                    type="textarea"
                                                    :autosize="{ minRows: 2 }"
                                                    placeholder="请输入"
                                            ></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="数据来源" prop="dataSources" class="needShowIconInfo">
                                    <el-input
                                            :disabled="modeControl.addDrawer"
                                            v-model="selectedKpi.dataSources"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            placeholder="请输入"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="kpiSlide-content">
                    <div class="title">员工自评</div>
                    <el-form ref="form" label-width="80px">
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="得分系数">
                                    <el-input
                                            @blur="handleEvaluationScoreCoefficientBlur"
                                            :disabled="modeControl.examinedWrite"
                                            v-model="selectedKpi.evaluationScoreCoefficient"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="得分指标">
                                    <el-input
                                            :disabled="modeControl.examinedWrite"
                                            v-model="selectedKpi.evaluationScore"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="自评备注" prop="evaluationRemark">
                                    <el-input
                                            :disabled="modeControl.examinedWrite"
                                            v-model="selectedKpi.evaluationRemark"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            placeholder="指标得分系数高于1.1或低于0.8需进行原因分析"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="kpiSlide-content">
                    <div class="title">主考评分</div>
                    <el-form ref="form" label-width="80px">
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="得分系数" prop="examinedScoreCoefficient">
                                    <el-input
                                            @blur="handleExaminedScoreCoefficientBlur"
                                            :disabled="modeControl.examinerWrite"
                                            v-model="selectedKpi.examinedScoreCoefficient"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="得分指标" prop="examinedScore">
                                    <el-input
                                            :disabled="modeControl.examinerWrite"
                                            v-model="selectedKpi.examinedScore"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col>
                                <el-form-item label="自评备注" prop="examinedRemark">
                                    <el-input
                                            :disabled="modeControl.examinerWrite"
                                            v-model="selectedKpi.examinedRemark"
                                            type="textarea"
                                            :autosize="{ minRows: 2 }"
                                            placeholder="主考评核指标得分系数高于1.1或低于0.8需进行原因分析"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import {reqAddKpilist, reqAddExamine, reqPerformanceInformation, reqGetKpilist, reqDeleteKpilist} from '../../../api/index.js'
    import {mul} from '../../../utils/utils';

    export default {
        name: 'baseform',
        components: {},
        data() {
            return {
                userId: '', //被考核人id
                codeId: '', //主考人id
                date:'',//当前日期
                examined: false,//是否为被考核人
                examiner: false, //是否为主考人
                evaluationRemarkAnother: false, // 自评中并达到条件时备注必填
                examinedRemarkAnother: false, // 主评中并达到条件时备注必填
                modeControl:{
                    addDrawer: false, // kpi新增按钮
                    work: true, //绩效总结
                    fail: true, //面谈记录
                    examinedWrite: true, //被考核人填写
                    examinerWrite: true, //主考人填写
                },
                drawer: false,
                kpiListArr: [],//kpi列表
                formData: {
                    weightTotal: 0,
                    status: 0
                },//全部数据
                selectedKpi: {}, // 选中当前kpi
                selectedKpiIndex: '', // 选中当前kpi的index
                wrongKpiIndex: '',//校验错误kpi的index
                options: [
                    {
                        value: '定量KPI-正向',
                        label: '定量KPI-正向'
                    },
                    {
                        value: '定量KPI-负向',
                        label: '定量KPI-负向'
                    },
                    {
                        value: '定性KPI',
                        label: '定性KPI'
                    }
                ],
                value: ''
            };
        },
        watch:{
            'baseDate'(){
                this.getDataList();
            }
        },
        filters: {
            scoreFilter(val, str) {
                if (val == undefined || val === '') {
                    return str;
                } else {
                    return val;
                }
            },
            statusKey(val){
                switch (val) {
                    case 0 : return '待创建绩效计划'; break;
                    case 10 : return '待被考核人确定'; break;
                    case 20 : return '待主考确认'; break;
                    case 30 : return '待被考核人自评'; break;
                    case 40 : return '待主考人评价'; break;
                    case 50 : return '完结'; break;
                    default: return '未创建'
                }
            }
        },
        mounted() {
            this.getDataList();
        },
        created() {
        },
        activated() {
            this.getDataList();
        },
        computed:{
            ...mapState(['userInfo','baseDate']),
        },
        methods: {
            //获取绩效信息
            async getDataList(){
                if(this.$route.query.userId){
                    this.userId = this.$route.query.userId;
                    this.codeId = this.userInfo.id;
                    this.examiner = true;
                    console.log('主考查看被考核人信息')
                } else {
                    this.userId = this.userInfo.id;
                    this.examined = true;
                    console.log('被考核人信息')
                }
                this.date = this.baseDate;
                const userId = this.userId;
                const baseDate = this.baseDate;
                await reqPerformanceInformation({ userId, baseDate}).then(res => {
                    if(res.code === 0){
                        this.formData = res.data;
                        this.modeControls();
                    } else {
                        this.formData = {};
                    }
                });
                reqGetKpilist({ userId, baseDate}).then(res => {
                    if(res.code === 0){
                        this.kpiListArr = res.data;
                        this.modeControls();
                    } else {
                        this.kpiListArr = {};
                    }
                });
                this.modeControls();
            },

            //控制页面规则
            modeControls(){
                this.formData.weightTotal = 0;
                this.formData.evaluationScoreTotal = 0;
                this.formData.examinedScoreTotal = 0;
                if(this.kpiListArr.length > 0) {
                    this.kpiListArr.forEach(item => {
                        this.formData.weightTotal += Number(item.weight)
                        this.formData.evaluationScoreTotal += Number(item.evaluationScore)
                        this.formData.examinedScoreTotal += Number(item.examinedScore)
                    });
                }
                console.log(this.formData.weightTotal,'总权重')
                //新增按钮
                if((this.formData.status == 0 || this.formData.status == undefined) && this.examiner){
                    this.modeControl.addDrawer = false
                } else{
                    this.modeControl.addDrawer = true
                }
                //绩效总结
                if(this.formData.status == 30 && this.examined){
                    this.modeControl.examinedWrite = false;
                }
                //面谈记录
                if(this.formData.status == 40 && this.examiner){
                    this.modeControl.examinerWrite = false;
                }
            },
            //进入KPI详情
            showKpiDetail(item, index) {
                if (index === this.wrongKpiIndex) {
                    this.wrongKpiIndex = '';
                }
                if (!this.drawer) {
                    this.selectedKpi = item;
                    this.selectedKpiIndex = index;
                    this.drawer = !this.drawer;
                } else {
                    this.selectedKpi = item;
                    this.selectedKpiIndex = index;
                }
            },
            showKpiSlide() {
                this.drawer = !this.drawer;
            },
            //是否关闭
            handleClose(done) {
                this.showKpiSlide();
                this.selectedKpi = {};
                this.selectedKpiIndex = '';
            },
            //保存KPI详情
            saveKpi(){
                const baseDate = this.date;
                const userId = this.userId;
                const codeId = this.codeId;
                const {
                    _id,
                    targetName,
                    scoreGroup,
                    weight,
                    description,
                    currentAims,
                    actualScore,
                    formula,
                    dataSources,
                    evaluationScoreCoefficient,
                    evaluationScore,
                    evaluationRemark,
                    examinedScoreCoefficient,
                    examinedScore,
                    examinedRemark } = this.selectedKpi;
                reqAddKpilist({
                    _id,
                    userId,
                    codeId,
                    baseDate,
                    targetName,
                    scoreGroup,
                    weight,
                    description,
                    currentAims,
                    actualScore,
                    formula,
                    dataSources,
                    evaluationScoreCoefficient,
                    evaluationScore,
                    evaluationRemark,
                    examinedScoreCoefficient,
                    examinedScore,
                    examinedRemark }).then((res) => {
                        if(res.code === 0){
                          this.$message({
                              message: '保存成功',
                              type: 'success'
                          });
                            this.getDataList();
                            this.drawer = false;
                            this.selectedKpi = {};
                        } else {
                          this.$message({
                              message: '保存失败',
                              type: 'error'
                          })
                        }
                }).catch(err => {
                    this.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                    console.log(err)
                })

            },
            //删除KPI详情
            removeKpi(){
                const _id = this.selectedKpi._id
                reqDeleteKpilist({_id}).then(res => {
                    if(res.code == 0){
                      this.$message({
                          message: '删除成功',
                          type: 'success'
                      });
                      this.getDataList();
                      this.drawer = false;
                    } else {
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                })
            },

            // 处理权重模糊，取值范围是[5, 100]
            handleWeightBlur() {
                let weight = Number(this.selectedKpi.weight);
                if (Number.isNaN(weight)) {
                    this.selectedKpi.weight = '';
                } else if (weight < 5) {
                    this.selectedKpi.weight = 5;
                } else if (weight > 100) {
                    this.selectedKpi.weight = 100;
                } else {
                    this.selectedKpi.weight = parseInt(weight);
                }
                // 计算指标得分
                this.calScore();
            },
            // 处理员工得分系数自主填写模糊（已经有限制权限，无权限前不会触发）
            handleEvaluationScoreCoefficientBlur() {
                // 限制[0, 2.0]
                let evaluationScoreCoefficient = Number(this.selectedKpi.evaluationScoreCoefficient);
                if (Number.isNaN(evaluationScoreCoefficient)) {
                    this.selectedKpi.evaluationScoreCoefficient = '0';
                } else if (evaluationScoreCoefficient <= 0) {
                    this.selectedKpi.evaluationScoreCoefficient = '0';
                } else if (evaluationScoreCoefficient > 2) {
                    this.selectedKpi.evaluationScoreCoefficient = 2.0;
                }
                else {
                    this.selectedKpi.evaluationScoreCoefficient = evaluationScoreCoefficient.toFixed(2);
                }
                // 计算指标得分
                this.calScore();
                this.checkRemark();
            },
            // 处理主考得分系数自主填写模糊（已经有限制权限，无权限前不会触发）
            handleExaminedScoreCoefficientBlur() {
                // 限制[0, 2.0]
                let examinedScoreCoefficient = Number(this.selectedKpi.examinedScoreCoefficient);
                if (Number.isNaN(examinedScoreCoefficient)) {
                    this.selectedKpi.examinedScoreCoefficient = '0';
                } else if (examinedScoreCoefficient <= 0) {
                    this.selectedKpi.examinedScoreCoefficient = '0';
                }
                else if (examinedScoreCoefficient > 2) {
                    this.selectedKpi.examinedScoreCoefficient = 2.0;
                }
                else {
                    this.selectedKpi.examinedScoreCoefficient = examinedScoreCoefficient.toFixed(2);
                }
                // 计算指标得分
                this.calScore();
                this.checkRemark();
            },
            // kpi详情计算指标得分（员工和主考)
            calScore() {
                let weight = Number(this.selectedKpi.weight);
                let evaluationScoreCoefficient = Number(this.selectedKpi.evaluationScoreCoefficient);
                let examinedScoreCoefficient = Number(this.selectedKpi.examinedScoreCoefficient);
                // 有一个未输入就不参加计算
                if (this.selectedKpi.weight && this.selectedKpi.evaluationScoreCoefficient) {
                    this.selectedKpi.evaluationScore = mul(weight, evaluationScoreCoefficient);
                } else {
                    this.selectedKpi.evaluationScore = '';
                }
                if (this.selectedKpi.weight && this.selectedKpi.examinedScoreCoefficient) {
                    this.selectedKpi.examinedScore = mul(weight, examinedScoreCoefficient);
                } else {
                    this.selectedKpi.examinedScore = '';
                }
            },
            // 判断自评备注/主评备注是否必输
            checkRemark() {
                // ＞1.1或系数＜0.8时，自评备注必填
                if (String(this.selectedKpi.evaluationScoreCoefficient)) {
                    if (Number(this.selectedKpi.evaluationScoreCoefficient) > 1.1 || Number(this.selectedKpi.evaluationScoreCoefficient) < 0.8) {
                        this.evaluationRemarkAnother = true;
                    } else {
                        this.evaluationRemarkAnother = false;
                    }
                } else {
                    this.evaluationRemarkAnother = false;
                }
                // 当指标类别=定性指标，且单项指标系数＞1.1或系数＜0.8时，主评备注必填
                if (String(this.selectedKpi.examinedScoreCoefficient)) {
                    if (Number(this.selectedKpi.examinedScoreCoefficient) > 1.1 || Number(this.selectedKpi.examinedScoreCoefficient) < 0.8) {
                        this.examinedRemarkAnother = true;
                    } else {
                        this.examinedRemarkAnother = false;
                    }
                } else {
                    this.examinedRemarkAnother = false;
                }
            },
            //新增绩效计划
            submitPerformancePlan(val){
                if(this.formData.weightTotal != 100 ){
                  this.$message.error('总权重必须为100')
                } else if (val == 40 ){
                    const evaluationStatus = this.kpiListArr.every(item => {
                        console.log(item.evaluationScore)
                        return item.evaluationScore
                    })
                    if(evaluationStatus && this.formData.failReason && this.formData.failResolve){
                        this.changePerformanceStatus(val);
                    } else {
                      this.$message.error('请按要求填写自评内容')
                    }
                } else if(val == 50){
                    const evaluationStatus = this.kpiListArr.every(item => {
                        return item.examinedScore
                    })
                    if(evaluationStatus && this.formData.workResult && this.formData.suggestion){
                        this.changePerformanceStatus(val);
                    } else {
                        this.$message.error('请按要求填写自评内容')
                    }
                } else {
                    this.changePerformanceStatus(val);
                }
            },
            changePerformanceStatus(val){
                const baseDate = this.date;
                const userId = this.userId;
                const codeId = this.codeId;
                const status = val;
                const { _id, weightTotal, evaluationScoreTotal, examinedScoreTotal, failReason, failResolve, workResult, suggestion} = this.formData;
                reqAddExamine({ _id, userId, codeId, status, weightTotal, evaluationScoreTotal, examinedScoreTotal, baseDate, failReason, failResolve, workResult, suggestion}).then((res) => {
                    if(res.code === 0){
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getDataList();
                    } else {
                        this.$message({
                            message: '操作成功失败',
                            type: 'error'
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: '提交绩效计划失败',
                        type: 'error'
                    })
                })

            }
        }
    };
</script>

<style scoped lang="scss">
    .container {
        margin-bottom: 20px;
        &:last-of-type{
            margin-bottom: 0px;
    }
        .kpi-header {
            display: flex;
            line-height: 25px;
            justify-content: space-between;
            .header-left {
                font-weight: bolder;
                font-size: 28px;

                .el-icon-chat-dot-round,.el-icon-s-data {
                    color: #409EFF;
                }

                .font {
                    margin-left: 15px;
                }
            }

            .header-right {
                display: flex;

                .grade {
                    display: flex;

                    .font {
                        color: #8c939d;
                    }

                    .score {
                        margin: 0 20px 0 10px;
                    }
                }
            }
        }
        .kpi-content {
            padding: 20px;
            .kpi-list {
                padding: 20px;
                background-color: #f1f5fc;
                margin-bottom: 10px;
                cursor: pointer;
                &:last-of-type {
                    margin-bottom: 0;
                }

                &.selected {
                    background-color: #2298fe;

                    .line {
                        .title {
                            color: #FFF;
                        }

                        .weight {
                            color: #FFF;
                        }

                        .right {
                            span {
                                color: #FFF;
                            }

                            i {
                                color: #FFF;
                            }
                        }
                    }
                }

                &.wrong {
                    background-color: #f56c6c;

                    .line {
                        .title {
                            color: #FFF;
                        }

                        .weight {
                            color: #FFF;
                        }

                        .right {
                            span {
                                color: #FFF;
                            }

                            i {
                                color: #FFF;
                            }
                        }
                    }
                }

                .line {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;

                    &:last-of-type {
                        margin-bottom: 0;
                    }

                    .title {
                        font-size: 16px;
                        color: #222222;
                        font-weight: bold;
                    }

                    .weight {
                        font-size: 13.33px;
                        color: #2399ff;
                    }

                    .left {
                        display: flex;
                        align-items: center;

                        .type {
                            font-size: 12px;
                            padding: 4px 8px;
                            margin-right: 10px;

                            &.type-quantify {
                                background-color: #d4e9ff;
                                color: #2399ff;
                            }

                            &.type-company {
                                background-color: #eedfd3;
                                color: #d4823f;
                            }
                        }
                    }

                    .right {
                        display: flex;

                        span {
                            color: #888888;
                            margin-left: 26px;
                            display: flex;
                            align-items: center;
                        }

                        i {
                            color: #222222;
                            margin-left: 6px;

                            &.notice {
                                color: #f56c6c;
                            }
                        }
                    }
                }
            }
        }
        .summarize-header{
            margin: 10px 0px;
            display: flex;
            justify-content: space-between;
            .header-left {
                .el-icon-document-copy {
                    color: #409EFF;
                    font-weight: bolder;
                    font-size: 28px;
                }
                .el-icon-document{
                    color: #409EFF;
                    font-weight: bolder;
                    font-size: 28px;
                }
                .font {
                    font-weight: bolder;
                    font-size: 28px;
                    margin-left: 15px;
                }
                .text{
                    font-size: 16px;
                    color: #888888;
                    margin-left: 10px;
                }
            }
            .header-right {
                span {
                    color: #888888;
                    margin-right: 26px;

                    i.emphasize {
                        color: red;
                    }

                    &:last-of-type {
                        margin-right: 0;
                    }
                }
                i {
                    color: #222222;
                    margin-left: 6px;
                }
            }
        }
        .summarize-content {
            padding: 20px;
            .target-list-wrapper {
                display: flex;
                .target-list {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding-right: 24px;

                    &:last-of-type {
                        padding-right: 0;
                    }

                    .desc {
                        color: #888888;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }

    .kpiSlide {
        width: 100%;
        height: 78%;
        overflow: auto;
        background-color: #E7EAED;

        .kpiSlide-header {
            background-color: white;
            display: flex;
            padding: 10px 20px;
            margin-bottom: 10px;
            justify-content: space-between;
            line-height: 50px;

            .left {
                color: #409EFF;

                .el-icon-arrow-left {
                    font-size: 20px;
                    font-weight: bolder;
                }
            }
        }

        .kpiSlide-content {
            background-color: white;
            padding: 20px;
            margin-bottom: 10px;
            &:last-of-type {
                margin-bottom: 0px;
                padding-bottom: 310px;
            }

            .title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .el-icon-view {
                color: #409EFF;
                margin: 0 18px 0 -3px;
            }
        }
    }


</style>