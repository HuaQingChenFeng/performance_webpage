<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 通知管理</el-breadcrumb-item>
                <el-breadcrumb-item>文本编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="40px">
                <el-form-item label="标题">
                    <el-input v-model="form.title" style="width: 800px"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.author" style="width: 800px"></el-input>
                </el-form-item>
                <quill-editor
                    ref="myTextEditor"
                    v-model="form.context"
                    @change="onEditorChange($event)"
                    :options="editorOption">
            </quill-editor>
            </el-form>
            <div class="btn">
                <el-button class="editor-btn" icon="el-icon-s-open" type="danger" @click="submitClean">清空</el-button>
                <el-button class="editor-btn" icon="el-icon-success" type="primary" @click="saveUraft">保存为草稿</el-button>
                <el-button class="editor-btn" icon="el-icon-s-promotion" type="success" @click="submit">发布公告</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import { reqSaveText, reqGetNotice } from '../../../api/index';
    import { sendNotice } from '../../../socketio/socketio';
    export default {
        name: 'editor',
        components: {
            quillEditor
        },
        data(){
            return {
                form:{
                    title:'',
                    author:'',
                    context: '',
                    _id:''
                },
                editorOption: {
                    placeholder: '请输入正文'
                },
                editor:null,
                releaseId:'',//公告唯一id
            }
        },
        created() {
            if(this.$route.query.releaseId){
                this.releaseId = this.$route.query.releaseId;
                this.getArt()
            }
        },
        mounted(){
            this.editor = this.$refs.myTextEditor.quill
        },
        methods: {
            //获取编辑详情
            getArt(){
                reqGetNotice({id:this.releaseId}).then(res => {
                    if(res.code === 0){
                        this.form = res.data[0]
                        console.log(res.data)
                    }
                })
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            //发布公告
            submit(){
                this.$confirm('是否确定发布公告?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        title:this.form.title,
                        author: this.form.author,
                        context: this.form.context,
                        _id: this.form._id,
                        status: 1
                    };
                    reqSaveText(params).then(res => {
                        if(res.code === 0){
                            //向服务器发送消息
                            sendNotice(res.data);

                            this.$router.push('/announcement');
                            this.$message.success('发布成功！');
                        } else {
                            this.$message.error('发布失败！');
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                })
            },
            //清空文本
            submitClean(){
                this.$confirm('是否清空文本内容?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.form = {}
                }).catch(() => {
                })
            },
            //保存为草稿
            saveUraft(){
                const params = {
                    title:this.form.title,
                    author: this.form.author,
                    context: this.form.context,
                    _id: this.form._id,
                    status: 0
                }
                reqSaveText(params).then(res => {
                    if(res.code === 0){
                        this.$router.push({
                            path:'announcement',
                        });
                        this.$message.success('保存成功！');
                    } else {
                        this.$message.error('保存失败！');
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .container{
        .btn{
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>