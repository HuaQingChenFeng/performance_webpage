<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="width">
        <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm">
            <el-form-item v-for="(item, index) in formList"
                          :key="index"
                          :prop="item.keyName"
                          :label="item.name" >
                <el-select v-if="item.type == 'select'" v-model="form[item.keyName]" :placeholder="item.placeholder">
                    <el-option
                            v-for="item in item.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-else v-model="form[item.keyName]" autocomplete="off" :placeholder="item.placeholder"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitTo('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'form-dialog',
        props:{
            //弹窗宽度
            width:{
                type: String,
                default: '50%'
            },
            //表单宽度
            formLabelWidth:{
                type: String,
                default: '100px'
            },
            //题目文本
            title:{
                type: String,
                required: true
            },
            //表单内容
            formData:{
                type: Object,
                default: () => ({})
            },
            //表单信息
            formList:{
                type: Array
            },
            //验证规则
            rules:{
                type: Object,
                default: () => ({})
            }
        },
        data(){
            return{
                dialogFormVisible: false,
                form: {},
            }
        },
        watch:{
            'formData'(newVal, oldVal){
                if(newVal){
                    this.form = this.formData
                }
            }
        },
        methods:{
            show(){
                this.dialogFormVisible = true;
            },
            hidden(){
                this.dialogFormVisible = false;
            },
            submitTo(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('submit',this.form);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped>

</style>