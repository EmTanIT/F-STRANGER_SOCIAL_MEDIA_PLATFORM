import express from 'express'
import Message from '../models/Message.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
import User from '../models/User.js'
import sequelize from 'sequelize'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const room = req.body.roomId
        const messages = await Message.findAll(
            {
                where: {
                    chatRoomId: room
                },
                attributes: [
                    ['userId', 'id'],
                    'chatRoomId',
                    ['content', 'contentT']
                ],
                include: {
                    model: User
                },
            }
        );
        console.log(messages.length);
        let messageList = [];
        messages.forEach((element, i) => {
            let senderN = {
                id: '',
                username: ''
            };
            let message = {
                content: element.dataValues.contentT,
                sender: senderN
            };
            senderN.id = element.id;
            senderN.username = element.user.username;
            messageList.push(message)
        });
        if (messageList.length != 0) {
            res.json(DataResponse(messageList))
        }
    } catch (error) {
        console.log(error);
        res.json(InternalErrorResponse())
    }
})

export default router