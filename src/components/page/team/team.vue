<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 团队管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
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
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
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
    </div>
</template>

<script>

import {reqRegister, reqUserlist, reqUpdate, reqDeleteUserlist} from '../../../api'
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
            },
        };
    },
    created() {
        this.getData();
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
        //获取团队列表
        getData() {
            let linearLeader = '';
            if(this.userInfo.type != 'admin'){
                linearLeader = this.userInfo.name
            }
            const type = this.userType;
            const {name, pageIndex, pageSize}  = this.query
            reqUserlist({type, name, pageIndex, pageSize, linearLeader}).then(res => {
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
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
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
