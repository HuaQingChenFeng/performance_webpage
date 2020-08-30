<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-custom"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="password">
                <div class="title">修改密码</div>
                <hr size="1" color="#CED1D9" style="margin: 20px 0px">
                <el-form :model="form" label-width="140px" :rules="rules" ref="ruleForm">
                    <el-form-item label="请输入原密码" prop="oldpassword" autocomplete="off">
                        <el-input v-model="form.oldpassword"></el-input>
                    </el-form-item>
                    <el-form-item label="设置新的密码" prop="newpassword" autocomplete="off">
                        <el-input v-model="form.newpassword"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新的密码" prop="newpassword1" autocomplete="off">
                        <el-input v-model="form.newpassword1" @blur="check"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {reqChangePassword} from '../../../api/index.js'
    import { mapState } from 'vuex'
    export default {
        name: 'password',
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newpassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                form:{
                    oldpassword: '',
                    newassword: '',
                    newpassword1: '',
                },
                rules: {
                    oldpassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                    newpassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[0-9A-Za-z]{6,16}$/, message: '需包含数字和大小写字母中至少两种字符的6-16位字符' }
                    ],
                    newpassword1: [
                        { required: true, validator: validatePass2, trigger: 'blur' },
                    ]
                }
            }
        },
        computed:{
            ...mapState(['userInfo']),
        },
        methods:{
            submitForm(formName) {
                const {_id, id} = this.userInfo;
                const password = this.form.oldpassword;
                const newpassword = this.form.newpassword;
                console.log(_id, id, password, newpassword)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        reqChangePassword({ _id, id, password, newpassword}).then(res => {
                            if(res.code === 0){
                              this.$message({
                                  type: 'success',
                                  message: '密码修改成功'
                              });
                                localStorage.removeItem('ms_username');
                                this.$router.push('/login');
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '密码修改失败'
                                })
                            }
                        }).catch(err => {
                            this.$message({
                                type: 'error',
                                message: '密码修改失败'
                            });
                            console.log(err)
                        })

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            check(){

            }
        }
    };
</script>

<style lang="scss" scoped>
    .container{
        display: flex;
        justify-content: center;
        align-items: center;
        .password{
            width: 580px;
            .title{
                font-size: 24px;
                color: #606266;
            }
        }
    }

</style>