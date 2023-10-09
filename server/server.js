// ===== Imports =====
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRouter from './routes/user.js'

// ===== Config =====
const server = express()
const PORT = process.env.PORT || 3000

// ===== Middlewares =====
server.use(cors())
server.use(bodyParser.json())

// ===== Routes =====
server.use('/users', userRouter)

server.listen(PORT, () => {
    console.log(`Server is listening at PORT=${PORT}`)
})
