import express from 'express'
import User from '../models/User.js'
import { DataResponse, NotFoundResponse, MessageResponse, InternalErrorResponse, ErrorResponse, UnauthorizedResponse } from '../common/reponses.js'
import Room from '../models/Room.js'
import ChatRoom from '../models/ChatRoom.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.findAll();
    if (users) {
        res.json(DataResponse(users))
    } else {
        res.json(InternalErrorResponse())
    }
})

router.post('/', async (req, res) => {
    const userData = req.body.username;
    const user = await User.findOne({
        where: {
            username: userData
        }
    })
    if (!user) {
        //chưa có thì tạo mới 1 User
        //tìm kiếm thử 1 phòng nào đang thiếu người
        //không tìm được phòng thì tạo một phòng mới
        //đợi khi nào có phòng thì chat
        //cứ 2 đứa thì nhét zô 1 phòng
        try {
            const newUser = await User.create({
                username: userData
            })//tạo mới 1 User

            let roomAvailable

            const roomCanUse = await Room.findAll(
                {
                    where: {
                        status: 1
                    }
                }
            )//Tìm phòng còn sử dụng được

            let checkRoom
            for (let i = 0; i < roomCanUse.length; i++) {
                checkRoom = await ChatRoom.findAll({
                    where: {
                        roomId: roomCanUse[i].id
                    }
                })
                if (checkRoom.length < 2) {
                    roomAvailable = await Room.findOne({
                        where: {
                            id: roomCanUse[i].id
                        }
                    })
                }
            }//tìm 1 phòng chưa đủ 2 người

            if (!roomAvailable) {//tìm được rồi
                //Join vô phòng đó thôi
                await ChatRoom.create({
                    userId: newUser.id,
                    roomId: roomAvailable.id
                })
                res.json(DataResponse(ChatRoom))
            } else {//chưa tìm được
                //Tạo mới phòng đó và ngồi đợi
                let roomNameR
                let roomF

                do {
                    roomNameR = Math.floor(Math.random() * 100000000);
                    roomF = Room.findOne({
                        where: {
                            roomName: roomNameR
                        }
                    })
                } while (roomF)//Generate 1 tên phòng mới

                const room = await Room.create({
                    roomName: roomNameR
                })//Tạo mới 1 phòng

                const chatRoom = await ChatRoom.create({
                    userId: newUser.id,
                    roomId: room.id
                })//Tạo mới 1 phòng chat

                res.json(DataResponse(room))
            }
        } catch (error) {
            console.log(error);
            res.json(InternalErrorResponse(500))
        }
    } else {
        try {
            let room
            const chatRoom = await ChatRoom.findAll({
                where: {
                    userId: user.id
                }
            })
            for (let i = 0; i < chatRoom.length; i++) {
                const element = chatRoom[i];
                room = await Room.findOne({
                    where: {
                        id: element.roomId,
                        status: 1
                    }
                })
            }
            res.json(DataResponse(room))
        } catch (error) {
            console.log(error);
            res.json(InternalErrorResponse(500))
        }
    }
})

export default router