<template>
    <div class="box">
        <div class="top">
            <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    @click="handleAdd"
            >新增部门</el-button>
        </div>
        <div class="table">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="departmentCode" label="部门编号" align="center"></el-table-column>
                <el-table-column label="部门名称" prop="departmentName" align="center"></el-table-column>
                <el-table-column label="部门介绍" prop="departmentInfo" align="center"></el-table-column>
                <el-table-column label="备注" prop="remarks" align="center"></el-table-column>
                <el-table-column label="操作"align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDeleted(scope.row._id)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div class="pagination">
            <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="pageNo"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
            ></el-pagination>
        </div>
        <show-dialog ref="addDepartment"
                     :title="'新增部门'"
                     :rules="departmentRules"
                     @submit="addDepartment"
                     :formList="formList"></show-dialog>
        <show-dialog ref="editDepartment"
                     :title="'编辑部门'"
                     :rules="departmentRules"
                     :formData="form"
                     @submit="updataDepartment"
                     :formList="formList"></show-dialog>
    </div>
</template>

<script>
    import showDialog from '../../../public/formDialog';
    import { reqAddDepartment, reqEditDepartment, reqDeletedDepartment, reqGetDepartment } from '../../../../api/index'
    export default {
        name: 'department',
        components:{
            showDialog
        },
        data(){
            return{
                tableData:[
                    {
                        departmentCode:'123456',
                        departmentName:'编辑接口',
                        departmentInfo:'风格回家好',
                        remarks:'123456',
                    }
                ],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 0,
                form:{},
                formList:[
                    {name: '部门编号', keyName: 'departmentCode'},
                    {name: '部门名称', keyName: 'departmentName'},
                    {name: '部门介绍', keyName: 'departmentInfo'},
                    {name: '备注', keyName: 'remarks'},
                ],
                departmentRules:{
                    departmentCode:[{ required: true, message: '请输入部门编号', trigger: 'blur' }],
                    departmentName:[{ required: true, message: '请输入部门名称', trigger: 'blur' }],
                    departmentInfo:[{ required: true, message: '请输入部门介绍', trigger: 'blur' }],
                }
            }
        },
        created() {
            this.getDepartment()
        },
        methods:{
            //获取
            getDepartment(){
                const pageNo = this.pageNo;
                const pageSize = this.pageSize;
                reqGetDepartment({pageSize, pageNo}).then(res => {
                    if(res.code === 0){
                      this.tableData = res.data;
                        this.pageTotal = res.count
                    }
                })
            },
            //新增
            handleAdd(){
                this.$refs.addDepartment.show()
            },
            addDepartment(data){
                const { departmentCode, departmentName, departmentInfo, remarks} = data
                reqAddDepartment({ departmentCode, departmentName, departmentInfo, remarks}).then(res => {
                    if (res.code === 0) {
                        this.getDepartment();
                        this.$refs.addDepartment.hidden()
                        this.$message.success('保存成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error('保存失败');
                });
            },
            //编辑
            handleEdit(data){
                this.form = data;
                this.$refs.editDepartment.show()
            },
            updataDepartment(data){
                const { _id, departmentCode, departmentName, departmentInfo, remarks} = data
                reqEditDepartment({ _id, departmentCode, departmentName, departmentInfo, remarks}).then(res => {
                    if (res.code === 0) {
                        this.getDepartment();
                        this.$refs.editDepartment.hidden()
                        this.$message.success('修改成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error('修改失败');
                });
            },
            //删除
            handleDeleted(id){
                const _id = id
                reqDeletedDepartment({ _id }).then(res => {
                    if(res.code === 0){
                      this.getDepartment();
                      this.$message.success('删除部门成功')
                    } else {
                        this.$message.error('删除部门失败')
                    }
                })
            },

            //分页
            handlePageChange(pageNo){
                this.pageNo = pageNo;
                this.getDepartment();
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize;
                this.getDepartment();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .top{
        margin-bottom: 20px;
    }

</style>