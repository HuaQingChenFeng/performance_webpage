<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-office-building"></i> 系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item> 企业架构</el-breadcrumb-item>
                </el-breadcrumb>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="企业管理" name="enterprise">
                    <div class="enterprise">
                        <el-form :model="enterpriseForm" :rules="enterpriseRules" ref="enterpriseForm"
                                 label-width="150px" class="demo-ruleForm">
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input v-model="enterpriseForm.enterpriseName"></el-input>
                            </el-form-item>
                            <el-form-item label="企业负责人" prop="proprietor">
                                <el-input v-model="enterpriseForm.proprietor"></el-input>
                            </el-form-item>
                            <el-form-item label="固定电话" prop="phone">
                                <el-input v-model="enterpriseForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式" prop="mobilePhone">
                                <el-input v-model="enterpriseForm.mobilePhone"></el-input>
                            </el-form-item>
                            <el-form-item label="企业邮箱" prop="mailbox">
                                <el-input v-model="enterpriseForm.mailbox"></el-input>
                            </el-form-item>
                            <el-form-item label="企业介绍" prop="introduce">
                                <el-input v-model="enterpriseForm.introduce"
                                          type="textarea"
                                          :autosize="{ minRows: 6}"
                                          :rows="2"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('enterpriseForm')">保存</el-button>
                                <el-button @click="resetForm('enterpriseForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="部门管理" name="department">
                    <department></department>
                </el-tab-pane>
                <el-tab-pane label="职位管理" name="position">
                    <position></position>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
    import department from './compeonents/department';
    import position from './compeonents/position';
    import { reqAddEnterprise, reqGetEnterprise, reqEditEnterprise } from '../../../api/index.js';

    export default {
        name: 'enterprise',
        components: {
            department,
            position
        },
        data() {
            return {
                activeName: 'department',
                enterpriseForm: {},//企业表单
                //验证
                enterpriseRules: {
                    enterpriseName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ],
                    mobilePhone: [
                        { min: 11, max: 11, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
                    ],
                    mailbox: [
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ]
                }
            };
        },
        created() {
            this.getEnterprise();
        },
        methods: {
            //获取企业信息
            getEnterprise() {
                reqGetEnterprise().then(res => {
                    if (res.code === 0) {
                        this.enterpriseForm = res.data[0];
                    }
                });
            },
            //保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const { enterpriseName, proprietor, phone, mobilePhone, mailbox, introduce, _id } = this.enterpriseForm;
                        if(_id){
                            reqEditEnterprise({ enterpriseName, proprietor, phone, mobilePhone, mailbox, introduce, _id }).then(res => {
                                if (res.code === 0) {
                                    this.getEnterprise();
                                    this.$message.success('保存成功');
                                } else {
                                    this.$message.error(res.msg);
                                }
                            }).catch(err => {
                                this.$message.error('保存失败');
                            });
                        } else {
                            reqAddEnterprise({
                                enterpriseName,
                                proprietor,
                                phone,
                                mobilePhone,
                                mailbox,
                                introduce
                            }).then(res => {
                                if (res.code === 0) {
                                    this.getEnterprise();
                                    this.$message.success('保存成功');
                                } else {
                                    this.$message.error(res.msg);
                                }
                            }).catch(err => {
                                this.$message.error('保存失败');
                            });
                        }
                    } else {
                        this.$message.error('请按照要求填写企业信息');
                    }
                });
            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        }
    };
</script>

<style lang="scss" scoped>
    .enterprise {
        width: 80%;
    }
</style>