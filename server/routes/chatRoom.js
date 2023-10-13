import express from 'express'
import ChatRoom from '../models/ChatRoom.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
import { deleteRoom } from './room.js'
import { deleteMessages } from './message.js'
import { deleteUser } from './user.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const chatRooms = await ChatRoom.findAll();
    if (chatRooms) {
        res.json(DataResponse(chatRooms))
    } else {
        res.json(InternalErrorResponse())
    }
})

router.delete('/', async (req, res) => {
    try {
        const room = req.body.roomId
        const result = await ChatRoom.destroy({
            where: {
                roomId: room
            }
        })
        await deleteMessages(room)
        await deleteUser(room)
        await deleteRoom(room)
        if (result) {
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