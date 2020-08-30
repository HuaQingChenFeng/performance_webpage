<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-global"></i> {{$t('i18n.breadcrumb')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="height: 200px; width: 200px">
                <img :src="imgHeader" alt="图片" style="width: 100px; height:100px">
            </div>
            <el-upload
                    class="avatar-uploader"
                    action="/api/uploadPicture"
                    name="img"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <span class="avatar-uploader-icon">上传头像</span>
            </el-upload>
        </div>
        <div class="plugins-tips">
            Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
            访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                imageUrl: '',
                imgHeader: 'http://localhost:4000/public/img/undefined-1583306335048.jpeg'
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                console.log(res.data)
                this.imageUrl = URL.createObjectURL(file.raw);
                this.imgHeader = `http://localhost:4000${res.data}`
                console.log(this.imgHeader)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .el-upload--text {
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100px;
        height: 50px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
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
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
</style>
