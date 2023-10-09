import express from 'express'
import Room from '../models/Room.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
const router = express.Router()

router.get('/', async (req, res) => {
    const rooms = await Room.findAll();
    if(rooms){
        res.json(DataResponse(rooms))
    } else {
        res.json(InternalErrorResponse())
    }
})

export default router