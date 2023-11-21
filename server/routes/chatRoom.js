import express from 'express'
import ChatRoom from '../models/ChatRoom.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
import { deleteRoom } from './room.js'
import { deleteMessages } from './message.js'
import { deleteUser } from './user.js'
import { getIo } from './websocket.js'
// import { getIo } from './websocket.js'

const router = express.Router()

const END_CHAT_EVENT = "end chat";

router.get('/', async (req, res) => {
    const chatRooms = await ChatRoom.findAll();
    if (chatRooms) {
        res.json(DataResponse(chatRooms))
    } else {
        res.json(InternalErrorResponse())
    }
})

router.post('/', async (req, res) => {
    try {
        const room = req.body.roomId
        const userList = await ChatRoom.findAll({
            where : {
                roomId : room
            },
            attributes:['userId']
        })
        const result = await ChatRoom.destroy({
            where: {
                roomId: room
            }
        })
        await deleteMessages(room)
        await deleteRoom(room)
        await deleteUser(userList)
        if (result) {
            const io = getIo()
            io.to(room).emit(END_CHAT_EVENT)
            res.json(MessageResponse("Deleted Room Chat !"))
        } else {
            res.json(InternalErrorResponse())
        }
    } catch (error) {
        console.log(error);
        res.json(InternalErrorResponse(error))
    }
})

export default router