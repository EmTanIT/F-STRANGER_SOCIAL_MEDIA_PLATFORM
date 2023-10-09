import express from 'express'
import User from '../models/User.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.findAll();
    if(users){
        res.json(DataResponse(users))
    } else {
        res.json(InternalErrorResponse())
    }
})

export default router