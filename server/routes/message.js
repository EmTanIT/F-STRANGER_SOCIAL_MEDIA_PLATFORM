import express from 'express'
import Message from '../models/Message.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const messages = await Message.findAll();
    if(messages){
        res.json(DataResponse(messages))
    } else {
        res.json(InternalErrorResponse())
    }
})

export default router