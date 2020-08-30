/*
包含n个请求函数的模块
函数的返回值：promise对象
*/

import ajax from './ajax'
const BASE_URL = '/api'


//登陆接口
export const reqLogin = ({username, password}) => ajax(BASE_URL+'/login', {username, password}, 'POST')
//新增企业考核人员接口
export const reqRegister = (user) => ajax(BASE_URL+ '/register', user, 'POST')
//更新企业考核人员信息接口
export const reqUpdate = (user) => ajax(BASE_URL+ '/update', user, 'POST')
//获取指定类型团队成员列表接口
export const reqUserlist = (filtrate) => ajax(BASE_URL+'/userlist', filtrate)
//删除团队成员列表接口
export const reqDeleteUserlist = (arrid) => ajax(BASE_URL+'/deleteUserList', arrid, 'POST')
//新增、修改绩效内容接口
export const reqAddExamine = (examine) => ajax(BASE_URL+'/addExamine', examine, 'POST')
//新增、修改KPI列表接口
export const reqAddKpilist = (kpilist) => ajax(BASE_URL+'/addKpiList', kpilist, 'POST')
//删除KPI列表接口
export const reqDeleteKpilist = ({_id}) => ajax(BASE_URL+'/addKpiList', {_id}, 'POST')
//获取kpi列表数据
export const reqGetKpilist = (kpilist) => ajax(BASE_URL+'/getKpiList', kpilist)
//获取指定绩效内容列表接口
export const reqPerformanceInformation = (performance) => ajax(BASE_URL+'/allPerformanceInformation', performance)
//获取指定绩效内容列表接口
export const reqChangePassword = ({ _id, id, password, newpassword }) => ajax(BASE_URL+'/changePassword', {_id, id, password, newpassword }, 'POST')
//获取当前用户个人信息
export const reqUserInfo = ({id}) => ajax(BASE_URL+'/userInfo/getUserInfo', {id})
//更新当前用户个人信息
export const reqUpdateUserInfo = (userInfo) => ajax(BASE_URL+'/userInfo/updateUserInfo', userInfo, 'POST')
//保存公告
export const reqSaveText = (notice) => ajax(BASE_URL+'/Notice/saveText', notice, 'POST')
//获取公告
export const reqGetNotice = (notice) => ajax(BASE_URL+'/Notice/getNotice', notice)
//删除发布列表公告
export const reqDeleteReleaseNotice = (notice) => ajax(BASE_URL+'/Notice/deleteNotice', notice, 'POST')
//获取信息公告
export const reqGetNoticeList = (notice) => ajax(BASE_URL+'/Notice/getUserNotice', notice)
//标记信息公告为已读
export const reqReadyReadNotice = (notice) => ajax(BASE_URL+'/Notice/readyReadNotice', notice, 'POST')
//删除发布列表公告
export const reqDeleteReadNotice = (notice) => ajax(BASE_URL+'/Notice/deleteReadNotice', notice, 'POST')
//删除发布列表公告
export const reqRecallNotice = (notice) => ajax(BASE_URL+'/Notice/recallNotice', notice, 'POST')
//新增代办事项
export const reqAddNote = (note) => ajax(BASE_URL+'/Note/addNote', note, 'POST')
//修改代办事项
export const reqEditNote = (note) => ajax(BASE_URL+'/Note/editNote', note, 'POST')
//删除代办事项
export const reqDeleteNote = (note) => ajax(BASE_URL+'/Note/deleteNote', note, 'POST')
//获取代办事项
export const reqGetNoteList = ({userId}) => ajax(BASE_URL+'/Note/getNoteList',{userId})
//新增企业管理
export const reqAddEnterprise = (data) => ajax(BASE_URL+'/framework/addEnterprise', data, 'POST')
//获取企业管理
export const reqGetEnterprise = () => ajax(BASE_URL+'/framework/getEnterprise')
//修改企业管理
export const reqEditEnterprise = (data) => ajax(BASE_URL+'/framework/editEnterprise', data, 'POST')
//新增部门
export const reqAddDepartment = (data) => ajax(BASE_URL+'/framework/addDepartment', data, 'POST')
// 获取部门
export const reqGetDepartment = (data) => ajax(BASE_URL+'/framework/getDepartment', data,'POST')
// 修改部门
export const reqEditDepartment = (data) => ajax(BASE_URL+'/framework/editDepartment', data, 'POST')
// 删除部门
export const reqDeletedDepartment = (data) => ajax(BASE_URL+'/framework/deletedDepartment', data, 'POST')
//新增职位
export const reqAddPosition = (data) => ajax(BASE_URL+'/framework/addPosition', data, 'POST')
// 获取职位
export const reqGetPosition = (data) => ajax(BASE_URL+'/framework/getPosition', data,'POST')
// 修改职位
export const reqEditPosition = (data) => ajax(BASE_URL+'/framework/editPosition', data, 'POST')
// 删除职位
export const reqDeletedPosition = (data) => ajax(BASE_URL+'/framework/deletedPosition', data, 'POST')
//获取当月工资情况
export const reqGetWages = ({userId, baseDate}) => ajax(BASE_URL+'/getWages',{userId, baseDate})
