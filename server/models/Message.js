import { DataTypes } from 'sequelize'

import SQLModel from '../common/SQLModel.js'
import sequelize from '../database/database.js'
import User from './User.js'
import ChatRoom from './ChatRoom.js'

const tableName = 'messages'

const Message = sequelize.define(tableName, {
    ...SQLModel,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    chatRoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ChatRoom,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

User.hasMany(Message, { foreignKey: 'userId' })
Message.belongsTo(User, { foreignKey: 'userId' })

ChatRoom.hasMany(Message, { foreignKey: 'chatRoomId' })
Message.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' })

Message.sync().then(() => {
    console.log(`${tableName}  table is Ready!`)
})

export default Message