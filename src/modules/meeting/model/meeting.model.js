const {DataTypes} = require("sequelize")
const sequelize = require("../../../config/database")

const Meeting = sequelize.define(
    "Meeting",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: "meetings",
        timestamps: true
    }
)

module.exports = Meeting