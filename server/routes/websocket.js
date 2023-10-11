import { Server as WSServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from '../models/Message.js'

const SEND_MESSAGE_EVENT = 'send message'
const UNAUTHORIZED_ERROR = 'unauthorized'

export function initWebsocket(serverInstance) {

    const io = new WSServer(serverInstance, {
        cors: '*'
    })

    io
        .use((socket, next) => {
            const token = socket.handshake.query
            if (!token) {
                next(new Error(UNAUTHORIZED_ERROR))
            }
            try {
                const data = jwt.verify(token.token, process.env.SECRET)
                /** data
                 *  - id
                 *  - username
                 *  - roomId
                 */
                socket.data = { ...data };
                socket.join(data.roomId)
                next()
            } catch (err) {
                console.log(err);
                next(new Error(UNAUTHORIZED_ERROR))
            }
        })//Đi qua 1 cái middle ware trước khi vào sự kiện connection
        .on('connection', socket => {
            const roomName = socket.data.roomId
            console.log(`${socket.id} connected`)

            socket.on(SEND_MESSAGE_EVENT, async msg => {
                const message = {
                    content: msg,
                    sender: {
                        id: socket.data.id,
                        username: socket.data.username
                    }
                }
                await Message.create({
                    userId: socket.data.id,
                    chatRoomId : socket.data.roomId,
                    content: "" + msg + ""
                })
                socket.to(roomName).emit(SEND_MESSAGE_EVENT, message)
            })

            socket.on('disconnect', () => {
                console.log(`${socket.id} disconnected`)
            })
        })

}