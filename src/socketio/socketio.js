
import io from 'socket.io-client'
import store from '../store/index'
import { reqGetNoticeList } from '../api';
//连接服务器，得到与服务器的连接对象
const socket = io('ws://localhost:4000')

export const sendNotice = (data => {
    //发送消息
    socket.emit('sendMsg', data)
    console.log('客户端向服务器发消息',data)
})

//绑定监听，接收服务器发送的消息
socket.on('receiveMsg', function(data) {
    console.log('服务器向客户端发消息',data)
    store.dispatch('recordNotice', data);
})

