import { DataTypes } from 'sequelize'

import SQLModel from '../common/SQLModel.js'
import sequelize from '../database/database.js'
import User from './User.js'
import Room from './Room.js'

const tableName = 'chatRooms'

const ChatRoom = sequelize.define(tableName, {
    ...SQLModel,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id'
        }
    },
})

User.hasMany(ChatRoom, { foreignKey: 'userId' })
ChatRoom.belongsTo(User, { foreignKey: 'userId' })

Room.hasMany(ChatRoom, { foreignKey: 'roomId' })
ChatRoom.belongsTo(Room, { foreignKey: 'roomId' })

await ChatRoom.sync().then(() => {
    console.log(`${tableName} table is Ready!`)
})

export default ChatRoom