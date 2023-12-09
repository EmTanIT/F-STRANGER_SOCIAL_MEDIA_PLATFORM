// ===== Imports =====
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.js'
import roomRouter from './routes/room.js'
import chatRoomRouter from './routes/chatRoom.js'
import messageRouter from './routes/message.js'
import overwriteResponseJSON from '../server/middlewares/overwriteResponseJSON.js'
import { initWebsocket } from './routes/websocket.js'


// ===== Config =====
const server = express()
const PORT = process.env.PORT || 3000

// ===== Middlewares =====
server.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())
server.use(overwriteResponseJSON)
// ===== Routes =====
server.use('/users', userRouter)
server.use('/rooms', roomRouter)
server.use('/chatRooms', chatRoomRouter)
server.use('/messages', messageRouter)

// Testing
const serverInstance = server.listen(PORT, () => {
    console.log(`Server is listening at PORT=${PORT}`)
})

initWebsocket(serverInstance)
