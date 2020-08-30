<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-custom"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item> 个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mine-content">
                <el-form :model="form" label-width="140px" ref="ruleForm">
                    <el-form-item label="我的头像：" prop="cropImg">
                        <div class="crop-demo">
                            <img :src="imageUrl" class="pre-img">
                            <div class="crop-demo-btn">
                                <el-upload
                                        class="avatar-uploader"
                                        action="/api/uploadPicture"
                                        name="img"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <span class=" avatar-uploader-icon">修改头像</span>
                                </el-upload>
                            </div>
                        </div>
                    </el-form-item>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="姓名：" prop="name">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户名：" prop="username">
                                <p>{{form.username}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="性别：" prop="sex">
                                <el-radio-group v-model="form.sex">
                                    <el-radio label="man">男</el-radio>
                                    <el-radio label="woman">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门：" prop="department">
                                <p>{{form.department | statusKey()}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="职位：" prop="position">
                                <p>{{form.position}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="月薪：" prop="salary">
                                <p>{{form.salary}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="爱好：" prop="hobby">
                                <el-input v-model="form.hobby"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="直系领导：" prop="linearLeader">
                                <p>{{ form.linearLeader}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="座右铭：" prop="motto">
                        <el-input type="textarea" v-model="form.motto" :autosize="{ minRows: 2}"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">保存信息</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </div>

    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs'
    import { mapState } from 'vuex'
    import { reqUserInfo, reqUpdateUserInfo } from '../../../api/index.js'

    export default {
        components: {
            VueCropper
        },
        data(){
            return {
                defaultSrc: require('../../../assets/img/img.jpg'),
                form: {},
                imageUrl: '',
            }
        },
        filters: {
            statusKey(val){
                switch (val) {
                    case 'president' : return '总裁办'; break;
                    case 'product' : return '产品研发部'; break;
                    case 'technology' : return '信息技术部'; break;
                    case 'market' : return '市场销售部'; break;
                    case 'finance' : return '财务部'; break;
                    default: return '待定'
                }
            }
        },
        mounted(){
            this.imageUrl = this.defaultSrc
            this.getUser()
        },
        computed: {
            ...mapState(['userInfo'])
        },
        created(){
        },
        methods:{
            //获取当前用户个人信息
            getUser(){
                const id = this.userInfo.id;
                reqUserInfo({id}).then(res => {
                    if(res.code === 0){
                        this.form = res.data
                        this.$store.dispatch('recordUser', this.form)
                    }
                    if(res.data.picture){
                        this.imageUrl = res.data.picture
                    }
                })
            },

            //上传图片
            handleAvatarSuccess(res, file) {
                this.imageUrl = `http://localhost:4000${res.data}`
            },
            beforeAvatarUpload(file) {
                const array = ['image/jpeg', 'image/png', 'image/png', 'image/gif']
                const isJPG = array.indexOf(file.type) !== -1;
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG/PNG/GIF 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            /*提交表单*/
            submitForm(){
                this.$confirm('是否保存修改内容', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const { _id, name, sex, hobby, motto } = this.form;
                    var picture = ''
                    if(this.imageUrl !== this.defaultSrc){
                        picture = this.imageUrl
                    }
                    reqUpdateUserInfo({ _id, name, sex, hobby, motto, picture}).then(res => {
                        if(res.code === 0){
                            this.$message({
                                type: 'success',
                                message: '更新成功!'
                            });
                            this.getUser();
                        } else {
                            this.$message({
                                type: 'error',
                                message: '保存失败'
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消保存'
                    });
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        p{
            color: #606266;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        .mine-content{
            width: 80%;
            .pre-img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #f8f8f8;
                border: 1px solid #eee;
            }
            .crop-demo{
                display: flex;
                align-items: flex-end;
            }
            .crop-demo-btn{
            }
            .crop-input{
                position: absolute;
                width: 100px;
                height: 40px;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }
        }
    }

    ::v-deep .el-upload--text {
        background-color: #fff;
        border: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100px;
        height: 30px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 14px;
        color: #409EFF;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }

</style>