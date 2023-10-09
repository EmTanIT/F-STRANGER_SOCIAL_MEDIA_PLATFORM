// ===== Imports =====
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRouter from './routes/user.js'
import roomRouter from './routes/room.js'
import chatRoomRouter from './routes/chatRoom.js'
import messageRouter from './routes/message.js'

// ===== Config =====
const server = express()
const PORT = process.env.PORT || 3000

// ===== Middlewares =====
server.use(cors())
server.use(bodyParser.json())

// ===== Routes =====
server.use('/users', userRouter)
server.use('/rooms', roomRouter)
server.use('/chatRooms', chatRoomRouter)
server.use('/messages', messageRouter)

server.listen(PORT, () => {
    console.log(`Server is listening at PORT=${PORT}`)
})
