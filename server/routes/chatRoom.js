import express from 'express'
import ChatRoom from '../models/ChatRoom.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const chatRooms = await ChatRoom.findAll();
    if(chatRooms){
        res.json(DataResponse(chatRooms))
    } else {
        res.json(InternalErrorResponse())
    }
})

export default router