/*
通过mutation间接更新state的多个方法的对象
*/
import {
    RECEIVE_USER_INFO,
    RECEIVE_BASE_DATE,
    RECEIVE_NEW_NOTICE,
    RECEIVE_MESSAGE_LENGTH
} from './mutation-types'

export default {
    // 同步记录用户信息
    recordUser({commit}, userInfo) {
        commit(RECEIVE_USER_INFO, {userInfo})
    },
    //同步记录当前选中时间
    recordBaseDate({commit}, baseDate) {
        commit(RECEIVE_BASE_DATE, {baseDate})
    },
    //同步新发布公告内容
    recordNotice({commit}, newNotice){
        commit(RECEIVE_NEW_NOTICE, {newNotice})
    },
    //同步新发布公告内容
    recordMessageLength({commit}, messageLength){
        commit(RECEIVE_MESSAGE_LENGTH, {messageLength})
    }

}