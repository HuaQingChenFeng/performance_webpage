<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-office-building"></i> 系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item> 用户管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div v-if="admin">
                    <el-button
                            type="primary"
                            icon="el-icon-circle-plus-outline"
                            class="handle-del mr10"
                            @click="handleAdd"
                    >新增</el-button>
                    <el-button
                            type="danger"
                            icon="el-icon-delete"
                            class="handle-del mr10"
                            @click="handleDelete"
                    >删除</el-button>
                    <el-select v-model="userType" placeholder="用户类型" class="handle-select mr10" @change="getData">
                        <el-option key="" label="全部" value=""></el-option>
                        <el-option key="admin" label="管理员" value="admin"></el-option>
                        <el-option key="satrap" label="主管" value="satrap"></el-option>
                        <el-option key="group" label="组长" value="group"></el-option>
                        <el-option key="member" label="普通成员" value="member"></el-option>
                    </el-select>
                </div>

                <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10" @change="handleSearch"/>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column label="所属部门" prop="department" align="center"></el-table-column>
                <el-table-column prop="position" label="职位" align="center"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.picture"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="入职时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.time | dateFormat('yyyy-MM-dd') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                v-if="admin"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-document"
                            class="green"
                            @click="toUserDetail(scope.$index, scope.row)"
                        >详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!--新增弹出框-->
        <el-dialog title="新增团队成员" :visible.sync="addVisible" width="50%" >
            <el-form ref="addForm" :rules="rules" :model="formInformation" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="formInformation.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio-group v-model="formInformation.sex">
                                <el-radio label="man">男</el-radio>
                                <el-radio label="woman">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="权限" prop="type">
                            <el-select v-model="formInformation.type" placeholder="请选择">
                                <el-option key="admin" label="管理员" value="admin"></el-option>
                                <el-option key="satrap" label="主管" value="satrap"></el-option>
                                <el-option key="group" label="组长" value="group"></el-option>
                                <el-option key="member" label="团队成员" value="member"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="department">
                            <el-select v-model="formInformation.department">
                                <el-option
                                        v-for="item in departmentOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="职位" prop="position">
                            <el-select v-model="formInformation.position">
                                <el-option
                                        v-for="item in positionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职时间">
                            <el-date-picker
                                    v-model="formInformation.time"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="formInformation.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码" prop="password">
                            <el-input v-model="formInformation.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="月薪">
                            <el-input v-model="formInformation.salary" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="直系领导">
                            <el-input v-model="formInformation.linearLeader"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="籍贯">
                            <el-input v-model="formInformation.birthplace"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证">
                            <el-input v-model="formInformation.identityID"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑团队成员" :visible.sync="editVisible" width="50%" >
            <el-form ref="editForm" :rules="rules" :model="editFormInformation" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="editFormInformation.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio-group v-model="editFormInformation.sex">
                                <el-radio label="man">男</el-radio>
                                <el-radio label="woman">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="权限" prop="type">
                            <el-select v-model="editFormInformation.type" placeholder="请选择">
                                <el-option key="admin" label="管理员" value="admin"></el-option>
                                <el-option key="satrap" label="主管" value="satrap"></el-option>
                                <el-option key="group" label="组长" value="group"></el-option>
                                <el-option key="member" label="团队成员" value="member"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="department">
                            <el-select v-model="editFormInformation.department">
                                <el-option
                                        v-for="item in departmentOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="职位" prop="position">
                            <el-select v-model="editFormInformation.position">
                                <el-option
                                        v-for="item in positionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职时间" prop="time">
                            <el-date-picker
                                    v-model="editFormInformation.time"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="editFormInformation.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码" prop="password">
                            <el-input v-model="editFormInformation.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="月薪" prop="salary">
                            <el-input v-model="editFormInformation.salary" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="直系领导" prop="linearLeader">
                            <el-input v-model="editFormInformation.linearLeader"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="籍贯" prop="birthplace">
                            <el-input v-model="editFormInformation.birthplace"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证" prop="identityID">
                            <el-input v-model="editFormInformation.identityID"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import {
        reqRegister,
        reqUserlist,
        reqUpdate,
        reqDeleteUserlist,
        reqGetDepartment,
        reqGetPosition
    } from '../../../api';
import { dateFormat } from '../../../utils/filters'
import { mapState } from 'vuex'

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false, //新增弹框
            userType: '',//用户类型
            pageTotal: 0,
            form: {},
            admin: false,
            formInformation: {
                username: '',
                password: '',
                sex:'man',
                type: 'member',
                name: '',
                department: '',
                birthplace: '',
                identityID: '',
                linearLeader: '',
                salary: '',
                position:''
            },
            editFormInformation:{},
            idx: -1,
            id: -1,
            rules: {
                username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
                            { min: 3, message: '长度在 5 到 5 个字符', trigger: 'blur' }],
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, message: '长度不少于2个字符', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码,长度在6到8个字符', trigger: 'blur' },
                    { min: 6, max: 8, message: '长度在 6 到 8个字符', trigger: 'blur' }],
                department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
                time: [{ required: true, message: '请选择日期', trigger: 'change' }],
                position: [{ required: true, message: '请选择职位', trigger: 'change' }],
            },
            departmentOptions:[],//部门选择
            positionOptions:[],//部门选择
        };
    },
    created() {
        this.getData();
        this.getDepartment();
        this.getPosiontion();
    },
    computed:{
        ...mapState(['userInfo']),
    },
    filters: {
        dateFormat(date, fmt) {
            if(date){
                return dateFormat(date, fmt);
            } else {
              return ''
            }

        }
    },
    methods: {
        //获取用户列表
        getData() {
            if(this.userInfo.type === 'admin'){
                this.admin = true;
            }
            const type = this.userType;
            const {name, pageIndex, pageSize}  = this.query
            console.log(pageIndex, pageSize)
            reqUserlist({type, name, pageIndex, pageSize}).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.count;
            })
        },
        //新增操作
        handleAdd(){
            this.formInformation = {sex:'man', type: 'member',};
            this.addVisible = true;
        },
        saveAdd(){
            const { username, password, name, sex, type, department, birthplace, identityID, linearLeader, salary, position, time } = this.formInformation;
            this.$refs.addForm.validate( async valid => {
                if (valid) {
                    const result = await reqRegister({username, password, name, sex, type, department, birthplace, identityID, linearLeader, salary, position, time});
                    if(result.code === 0){
                        const user = result.data;
                        this.getData();
                        this.addVisible = false;
                    } else {
                        const msg = result.msg;
                        this.$message.success(msg);
                    }
                } else {
                    this.$message.error('请完整填写信息');
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.delAllSelection();
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let arrid = [];
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                arrid.push(this.multipleSelection[i].id)
                str += this.multipleSelection[i].name + ' ';
            }
            reqDeleteUserlist({arrid}).then(res => {
                if (res.code === 0){
                    this.getData();
                    this.$message.error(`删除了${str}`);
                    this.multipleSelection = [];
                } else {
                    this.$message.error(`删除${str}失败`);
                }
            })


        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            console.log(row);
            this.editFormInformation = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            const {username, password, id, name, sex, type, department, birthplace, identityID, linearLeader, salary, position, time} = this.editFormInformation;
            console.log(id)
            this.$refs.editForm.validate( async valid => {
                if (valid) {
                    const result = await reqUpdate({username, id, password, name, sex, type, department, birthplace, identityID, linearLeader, salary, position, time});
                    if(result.code === 0){
                        const user = result.data;
                        this.getData();
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    } else {
                        const msg = result.msg;
                        this.$message.success(msg);
                    }
                } else {
                    this.$message.error('请完整填写信息');
                    return false;
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getData();
        },

        //详情
        toUserDetail(index, row){
            this.$router.push({
                path: '/form',
                query: {
                    userId: row.id,
                }
            })
        },
        //获取部门列表
        getDepartment() {
            this.departmentOptions = [];
            reqGetDepartment().then(res => {
                if (res.code === 0) {
                    const department = res.data;
                    department.forEach(item => {
                        this.departmentOptions.push({
                            value: item.departmentName,
                            label: item.departmentName
                        });
                    });
                }
            });
        },
        //获取职位列表
        getPosiontion() {
            this.positionOptions = [];
            reqGetPosition().then(res => {
                if (res.code === 0) {
                    const department = res.data;
                    department.forEach(item => {
                        this.positionOptions.push({
                            value: item.positionName,
                            label: item.positionName
                        });
                    });
                }
            });
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    display: flex;
}

.handle-select {
    width: 120px;
    margin-left: 10px;
}

.handle-input {
    width: 400px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.green {
    color: #73ff2e;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
