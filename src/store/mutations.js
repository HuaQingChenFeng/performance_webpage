/*
直接更新state的多个方法的对象
*/
import {
    RECEIVE_USER_INFO,
    RECEIVE_BASE_DATE,
    RECEIVE_NEW_NOTICE,
    RECEIVE_MESSAGE_LENGTH
} from './mutation-types'


export default {
    //用户信息
    [RECEIVE_USER_INFO](state, {userInfo}){
        state.userInfo = userInfo
    },
    //当前日期
    [RECEIVE_BASE_DATE](state, {baseDate}){
        if (baseDate){
            state.baseDate = baseDate
        } else {
            state.baseDate = 302002
        }

    },
    //新发布公告
    [RECEIVE_NEW_NOTICE](state, {newNotice}){
        state.newNotice = newNotice
    },
    //新消息条数
    [RECEIVE_MESSAGE_LENGTH](state, {messageLength}){
        state.messageLength = messageLength
    },

}
