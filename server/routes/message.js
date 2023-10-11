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
                include : {
                    model : User
                },
                // raw: true, // Include this option to get a flat JSON structure
            }
        );
        // res.json(DataResponse(messages))
        let message = {
            content: '',
            sender: ''
        }
        let senderN = {
            id: '',
            username: ''
        }
        console.log(messages);
        const messageList = []
        for (const key in messages) {
            let object = messages[key]
            console.log(object.id);
            console.log(object.dataValues.contentT);
            console.log('contentT' in object);
            // console.log(object.user);
            // if (Object.hasOwnProperty.call(messages, key)) {
            //     const element = messages[key];
            //     // Create a new message object for each iteration of the loop.
            //     const newMessage = Object.assign({}, message);
            //     newMessage.content = element.contentT;
            //     senderN.id = element.id;
            //     senderN.username = element.user.username;
            //     newMessage.sender = senderN;

            //     // Push the new message object into the array.
            //     messageList.push(newMessage);
            // }
        }
        if (messageList.length != 0) {
            res.json(DataResponse(messageList))
        }
    } catch (error) {
        console.log(error);
        res.json(InternalErrorResponse())
    }
})

export default router