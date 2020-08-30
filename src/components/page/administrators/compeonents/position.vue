<template>
    <div class="box">
        <div class="top">
            <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    @click="handleAdd"
            >新增职位
            </el-button>
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
                <el-table-column prop="positionCode" label="职位编号" align="center"></el-table-column>
                <el-table-column label="职位名称" prop="positionName" align="center"></el-table-column>
                <el-table-column label="所属部门" prop="departmentName" align="center"></el-table-column>
                <el-table-column label="职位介绍" prop="positionInfo" align="center"></el-table-column>
                <el-table-column label="备注" prop="remarks" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-document"
                                class="green"
                                @click="handleDeleted(scope.row._id)"
                        >删除
                        </el-button>
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
        <show-dialog ref="addPosition"
                     :title="'新增职位'"
                     :rules="positionRules"
                     @submit="addPosition"
                     :formList="formList"></show-dialog>
        <show-dialog ref="editPosition"
                     :title="'编辑职位'"
                     :rules="positionRules"
                     :formData="form"
                     @submit="updataPosition"
                     :formList="formList"></show-dialog>
    </div>
</template>

<script>
    import showDialog from '../../../public/formDialog';
    import {
        reqAddPosition,
        reqEditPosition,
        reqDeletedPosition,
        reqGetPosition, reqGetDepartment
    } from '../../../../api/index';

    export default {
        name: 'position',
        components: {
            showDialog
        },
        data() {
            return {
                tableData: [
                    {
                        positionCode: '123456',
                        positionName: '编辑接口',
                        departmentName: '信息技术部',
                        positionInfo: '风格回家好',
                        remarks: '123456'
                    }
                ],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 0,
                form: {},
                formList: [
                    { name: '职位编号', keyName: 'positionCode' },
                    { name: '职位名称', keyName: 'positionName' },
                    {
                        name: '所属部门', keyName: 'departmentName',
                        type: 'select',
                        options: [{
                            value: '选项1',
                            label: '黄金糕'
                        }, {
                            value: '选项2',
                            label: '双皮奶'
                        }, {
                            value: '选项3',
                            label: '蚵仔煎'
                        }, {
                            value: '选项4',
                            label: '龙须面'
                        }, {
                            value: '选项5',
                            label: '北京烤鸭'
                        }]
                    },
                    { name: '职位介绍', keyName: 'positionInfo' },
                    { name: '备注', keyName: 'remarks' }
                ],
                positionRules: {
                    positionCode: [{ required: true, message: '请输入职位编号', trigger: 'blur' }],
                    positionName: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
                    departmentName: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
                    positionInfo: [{ required: true, message: '请输入职位介绍', trigger: 'blur' }]
                }
            };
        },
        created() {
            this.getPosition();
            this.getDepartment();
        },
        methods: {
            //获取职位列表
            getPosition() {
                const pageNo = this.pageNo;
                const pageSize = this.pageSize;
                reqGetPosition({ pageSize, pageNo }).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data;
                        this.pageTotal = res.count;
                    }
                });
            },
            //获取
            getDepartment() {
                this.formList[2].options = [];
                reqGetDepartment().then(res => {
                    if (res.code === 0) {
                        const department = res.data;
                        department.forEach(item => {
                            this.formList[2].options.push({
                                value: item.departmentName,
                                label: item.departmentName
                            });
                        });
                    }
                });
            },
            //新增
            handleAdd() {
                this.$refs.addPosition.show();
            },
            addPosition(data) {
                const { positionCode, positionName, positionInfo, departmentName, remarks } = data;
                reqAddPosition({ positionCode, positionName, positionInfo, departmentName, remarks }).then(res => {
                    if (res.code === 0) {
                        this.getPosition();
                        this.$refs.addPosition.hidden();
                        this.$message.success('保存成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error('保存失败');
                });
            },
            //编辑
            handleEdit(data) {
                this.form = data;
                this.$refs.editPosition.show();
            },
            updataPosition(data) {
                const { _id, positionCode, positionName, departmentName, positionInfo, remarks } = data;
                reqEditPosition({
                    _id,
                    positionCode,
                    departmentName,
                    positionName,
                    positionInfo,
                    remarks
                }).then(res => {
                    if (res.code === 0) {
                        this.getPosition();
                        this.$refs.editPosition.hidden();
                        this.$message.success('修改成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error('修改失败');
                });
            },
            //删除
            handleDeleted(id) {
                const _id = id;
                reqDeletedPosition({ _id }).then(res => {
                    if (res.code === 0) {
                        this.getPosition();
                        this.$message.success('删除职位成功');
                    } else {
                        this.$message.error('删除部门失败');
                    }
                });
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
    .top {
        margin-bottom: 20px;
    }

</style>