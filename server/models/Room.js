import { DataTypes } from 'sequelize'

import SQLModel from '../common/SQLModel.js'
import sequelize from '../database/database.js'

const tableName = 'rooms'

const Room = sequelize.define(tableName, {
    ...SQLModel,
    roomName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
    }
})

await Room.sync().then(() => {
    console.log(`${tableName} table is Ready!`)
})

export default Room